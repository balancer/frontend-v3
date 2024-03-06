/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { ApolloClient, makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address, isAddress } from 'viem'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { useUserAccount } from '../web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { DefaultSwapHandler } from './handlers/DefaultSwap.handler'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { useSimulateSwapQuery } from './queries/useSimulateSwapQuery'
import { useTokens } from '../tokens/useTokens'
import { useUserSettings } from '../user/settings/useUserSettings'
import { useDisclosure } from '@chakra-ui/react'
import { useSwapStepConfigs } from './useSwapStepConfigs'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { SimulateSwapResponse } from './swap.types'
import { SwapHandler } from './handlers/Swap.handler'
import { useIterateSteps } from '../pool/actions/useIterateSteps'
import { isSameAddress } from '@/lib/shared/utils/addresses'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

type TokenInput = {
  address: Address
  amount: string
}

type SwapState = {
  tokenIn: TokenInput
  tokenOut: TokenInput
  swapType: GqlSorSwapType
  vaultVersion: number
}

const swapStateVar = makeVar<SwapState>({
  tokenIn: {
    address: emptyAddress,
    amount: '',
  },
  tokenOut: {
    address: emptyAddress,
    amount: '',
  },
  swapType: GqlSorSwapType.ExactIn,
  vaultVersion: 2,
})

// Unecessary for now but allows us to add logic to select other handlers in the future.
function selectSwapHandler(apolloClient: ApolloClient<object>): SwapHandler {
  return new DefaultSwapHandler(apolloClient)
}

export function _useSwap() {
  const swapState = useReactiveVar(swapStateVar)
  const [swapTxState, setSwapTxState] = useState<TransactionState>()

  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const [selectedChain, setSelectedChain] = useState<GqlChain>(GqlChain.Mainnet)

  const { isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const networkConfig = getNetworkConfig(selectedChain)
  const { getToken, usdValueForToken } = useTokens()
  const previewModalDisclosure = useDisclosure()

  const client = useApolloClient()
  const handler = useMemo(() => selectSwapHandler(client), [])

  const tokenInInfo = getToken(swapState.tokenIn.address, selectedChain)
  const tokenOutInfo = getToken(swapState.tokenOut.address, selectedChain)

  const shouldFetchSwap = (state: SwapState, swapAmount: string) =>
    isAddress(state.tokenIn.address) &&
    isAddress(state.tokenOut.address) &&
    !!state.swapType &&
    bn(swapAmount).gt(0)

  const getSwapAmount = (state: SwapState) =>
    (state.swapType === GqlSorSwapType.ExactIn ? state.tokenIn.amount : state.tokenOut.amount) ||
    '0'

  const simulationQuery = useSimulateSwapQuery({
    handler,
    swapInputs: {
      chain: selectedChain,
      tokenIn: swapState.tokenIn.address,
      tokenOut: swapState.tokenOut.address,
      swapType: swapState.swapType,
      swapAmount: getSwapAmount(swapState),
    },
    options: {
      enabled: shouldFetchSwap(swapState, getSwapAmount(swapState)),
    },
  })

  function handleSimulationResponse({
    returnAmount,
    vaultVersion,
    swapType,
  }: SimulateSwapResponse) {
    swapStateVar({
      ...swapState,
      vaultVersion: vaultVersion,
    })

    if (swapType === GqlSorSwapType.ExactIn) {
      setTokenOutAmount(returnAmount, { userTriggered: false })
    } else {
      setTokenInAmount(returnAmount, { userTriggered: false })
    }
  }

  function setTokenIn(tokenAddress: Address) {
    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenAddress,
      },
    })
  }

  function setTokenOut(tokenAddress: Address) {
    swapStateVar({
      ...swapState,
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenAddress,
      },
    })
  }

  function switchTokens() {
    swapStateVar({
      ...swapState,
      tokenIn: swapState.tokenOut,
      tokenOut: swapState.tokenIn,
      swapType: GqlSorSwapType.ExactIn,
    })
    setTokenInAmount('', { userTriggered: false })
    setTokenOutAmount('', { userTriggered: false })
  }

  function setTokenInAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    const state = swapStateVar()
    const newState = {
      ...state,
      tokenIn: {
        ...state.tokenIn,
        amount,
      },
    }

    if (userTriggered) {
      swapStateVar({
        ...newState,
        swapType: GqlSorSwapType.ExactIn,
      })
      setTokenOutAmount('', { userTriggered: false })
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from the other input.
      swapStateVar(newState)
    }
  }

  function setTokenOutAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    const state = swapStateVar()
    const newState = {
      ...state,
      tokenOut: {
        ...state.tokenOut,
        amount,
      },
    }

    if (userTriggered) {
      swapStateVar({
        ...newState,
        swapType: GqlSorSwapType.ExactOut,
      })
      setTokenInAmount('', { userTriggered: false })
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from
      // the other input.
      swapStateVar(newState)
    }
  }

  function setDefaultTokens() {
    const { tokenIn, tokenOut } = networkConfig.tokens.defaultSwapTokens || {}

    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenIn ? tokenIn : emptyAddress,
      },
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenOut ? tokenOut : emptyAddress,
      },
    })
  }

  const returnAmountUsd =
    swapState.swapType === GqlSorSwapType.ExactIn
      ? usdValueForToken(tokenOutInfo, swapState.tokenOut.amount)
      : usdValueForToken(tokenInInfo, swapState.tokenIn.amount)

  const priceImpact = simulationQuery.data?.priceImpact
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-'
  const priceImpacUsd = bn(priceImpact || 0).times(returnAmountUsd)
  const maxSlippageUsd = bn(slippage).div(100).times(returnAmountUsd)
  const isNativeAssetIn = isSameAddress(
    swapState.tokenIn.address,
    networkConfig.tokens.nativeAsset.address
  )
  const validAmountOut = bn(swapState.tokenOut.amount).gt(0)

  const swapStepConfigs = useSwapStepConfigs({
    humanAmountIn: swapState.tokenIn.amount,
    tokenIn: tokenInInfo,
    selectedChain,
    vaultVersion: swapState.vaultVersion,
    setSwapTxState,
  })
  const { currentStep, useOnStepCompleted } = useIterateSteps(swapStepConfigs)

  // On first render, set default tokens
  useEffect(() => {
    setDefaultTokens()
  }, [])

  // On selected chain change, set default tokens
  useEffect(() => {
    setDefaultTokens()
  }, [selectedChain])

  useEffect(() => {
    if (simulationQuery.data) {
      handleSimulationResponse(simulationQuery.data)
    }
  }, [simulationQuery.data])

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [simulationQuery.isLoading, 'Swap is loading'],
    [!validAmountOut, 'Invalid amount out']
  )

  return {
    ...swapState,
    tokenInInfo,
    tokenOutInfo,
    tokenSelectKey,
    selectedChain,
    simulationQuery,
    isDisabled,
    disabledReason,
    priceImpact,
    priceImpactLabel,
    priceImpacUsd,
    maxSlippageUsd,
    previewModalDisclosure,
    handler,
    swapTxState,
    currentStep,
    isNativeAssetIn,
    useOnStepCompleted,
    setTokenSelectKey,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenIn,
    setTokenOut,
    switchTokens,
  }
}

export function SwapProvider({ children }: PropsWithChildren) {
  const hook = _useSwap()
  return <SwapContext.Provider value={hook}>{children}</SwapContext.Provider>
}

export const useSwap = (): UseSwapResponse => useMandatoryContext(SwapContext, 'Swap')
