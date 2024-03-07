/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { ApolloClient, makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address, isAddress, parseUnits } from 'viem'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { useUserAccount } from '../web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { DefaultSwapHandler } from './handlers/DefaultSwap.handler'
import { bn } from '@/lib/shared/utils/numbers'
import { useSimulateSwapQuery } from './queries/useSimulateSwapQuery'
import { useTokens } from '../tokens/useTokens'
import { useDisclosure } from '@chakra-ui/react'
import { useSwapStepConfigs } from './useSwapStepConfigs'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { SdkSimulateSwapResponse, SimulateSwapResponse, SwapState } from './swap.types'
import { SwapHandler } from './handlers/Swap.handler'
import { useIterateSteps } from '../pool/actions/useIterateSteps'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useVault } from '@/lib/shared/hooks/useVault'
import { NativeWrapUnwrapHandler } from './handlers/NativeWrapUnwrap.handler'
import { isNativeWrapUnwrap } from './useWrapping'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

const swapStateVar = makeVar<SwapState>({
  tokenIn: {
    address: emptyAddress,
    amount: '',
    scaledAmount: BigInt(0),
  },
  tokenOut: {
    address: emptyAddress,
    amount: '',
    scaledAmount: BigInt(0),
  },
  swapType: GqlSorSwapType.ExactIn,
  selectedChain: GqlChain.Mainnet,
})

// Unecessary for now but allows us to add logic to select other handlers in the future.
function selectSwapHandler(
  tokenInAddress: Address,
  tokenOutAddress: Address,
  chain: GqlChain,
  apolloClient: ApolloClient<object>
): SwapHandler {
  if (isNativeWrapUnwrap(tokenInAddress, tokenOutAddress, chain)) {
    return new NativeWrapUnwrapHandler(apolloClient)
  }
  return new DefaultSwapHandler(apolloClient)
}

export function _useSwap() {
  const swapState = useReactiveVar(swapStateVar)
  const [swapTxState, setSwapTxState] = useState<TransactionState>()

  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')

  const { isConnected } = useUserAccount()
  const { getToken } = useTokens()

  const networkConfig = getNetworkConfig(swapState.selectedChain)
  const previewModalDisclosure = useDisclosure()

  const client = useApolloClient()
  const handler = useMemo(
    () =>
      selectSwapHandler(
        swapState.tokenIn.address,
        swapState.tokenOut.address,
        swapState.selectedChain,
        client
      ),
    [swapState.tokenIn.address, swapState.tokenOut.address, swapState.selectedChain]
  )

  const isTokenInSet = swapState.tokenIn.address !== emptyAddress
  const isTokenOutSet = swapState.tokenOut.address !== emptyAddress

  const tokenInInfo = getToken(swapState.tokenIn.address, swapState.selectedChain)
  const tokenOutInfo = getToken(swapState.tokenOut.address, swapState.selectedChain)

  if ((isTokenInSet && !tokenInInfo) || (isTokenOutSet && !tokenOutInfo)) {
    throw new Error('Token metadata not found')
  }

  const shouldFetchSwap = (state: SwapState) =>
    isAddress(state.tokenIn.address) &&
    isAddress(state.tokenOut.address) &&
    !!state.swapType &&
    bn(getSwapAmount(swapState)).gt(0)

  const getSwapAmount = (state: SwapState) =>
    (state.swapType === GqlSorSwapType.ExactIn ? state.tokenIn.amount : state.tokenOut.amount) ||
    '0'

  const simulationQuery = useSimulateSwapQuery({
    handler,
    swapInputs: {
      chain: swapState.selectedChain,
      tokenIn: swapState.tokenIn.address,
      tokenOut: swapState.tokenOut.address,
      swapType: swapState.swapType,
      swapAmount: getSwapAmount(swapState),
    },
    options: {
      enabled: shouldFetchSwap(swapState),
    },
  })

  function handleSimulationResponse({ returnAmount, swapType }: SimulateSwapResponse) {
    swapStateVar({
      ...swapState,
      swapType,
    })

    if (swapType === GqlSorSwapType.ExactIn) {
      setTokenOutAmount(returnAmount, { userTriggered: false })
    } else {
      setTokenInAmount(returnAmount, { userTriggered: false })
    }
  }

  function setSelectedChain(selectedChain: GqlChain) {
    const defaultTokenState = getDefaultTokenState(selectedChain)
    swapStateVar({
      ...defaultTokenState,
      selectedChain,
    })
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
        scaledAmount: scaleTokenAmount(amount, tokenInInfo),
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
        scaledAmount: scaleTokenAmount(amount, tokenOutInfo),
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

  function getDefaultTokenState(chain: GqlChain) {
    const {
      tokens: { defaultSwapTokens },
    } = getNetworkConfig(chain)
    const { tokenIn, tokenOut } = defaultSwapTokens || {}

    return {
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenIn ? tokenIn : emptyAddress,
      },
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenOut ? tokenOut : emptyAddress,
      },
    }
  }

  function scaleTokenAmount(amount: string, token: GqlToken | undefined): bigint {
    if (!token) throw new Error('Cant scale amount without token metadata')
    return parseUnits(amount, token.decimals)
  }

  const isNativeAssetIn = isSameAddress(
    swapState.tokenIn.address,
    networkConfig.tokens.nativeAsset.address
  )
  const validAmountOut = bn(swapState.tokenOut.amount).gt(0)

  const vaultVersion = (simulationQuery.data as SdkSimulateSwapResponse)?.vaultVersion || 2
  const { vaultAddress } = useVault(vaultVersion)

  const swapStepConfigs = useSwapStepConfigs({
    humanAmountIn: swapState.tokenIn.amount,
    tokenIn: tokenInInfo,
    selectedChain: swapState.selectedChain,
    vaultAddress,
    setSwapTxState,
  })
  const { currentStep, useOnStepCompleted } = useIterateSteps(swapStepConfigs)

  // On first render, set default tokens
  useEffect(() => {
    swapStateVar(getDefaultTokenState(swapState.selectedChain))
  }, [])

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
    simulationQuery,
    isDisabled,
    disabledReason,
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
