'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { ApolloClient, useApolloClient, useReactiveVar } from '@apollo/client'
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
import {
  OSwapAction,
  SdkSimulateSwapResponse,
  SimulateSwapResponse,
  SwapAction,
  SwapState,
} from './swap.types'
import { SwapHandler } from './handlers/Swap.handler'
import { useIterateSteps } from '../transactions/transaction-steps/useIterateSteps'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useVault } from '@/lib/shared/hooks/useVault'
import { NativeWrapHandler } from './handlers/NativeWrap.handler'
import {
  getWrapHandlerClass,
  getWrapType,
  getWrapperForBaseToken,
  isNativeWrap,
  isSupportedWrap,
  isWrapOrUnwrap,
} from './wrap.helpers'
import { useTokenInputsValidation } from '../tokens/useTokenInputsValidation'
import { useMakeVarPersisted } from '@/lib/shared/hooks/useMakeVarPersisted'
import { HumanAmount } from '@balancer/sdk'
import { ChainSlug, chainToSlugMap, slugToChainMap } from '../pool/pool.utils'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

type PathParams = {
  chain?: string
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  amountOut?: string
}

function selectSwapHandler(
  tokenInAddress: Address,
  tokenOutAddress: Address,
  chain: GqlChain,
  apolloClient: ApolloClient<object>
): SwapHandler {
  if (isNativeWrap(tokenInAddress, tokenOutAddress, chain)) {
    return new NativeWrapHandler(apolloClient)
  } else if (isSupportedWrap(tokenInAddress, tokenOutAddress, chain)) {
    const WrapHandler = getWrapHandlerClass(tokenInAddress, tokenOutAddress, chain)
    return new WrapHandler()
  }

  return new DefaultSwapHandler(apolloClient)
}

export function _useSwap(pathParams: PathParams) {
  const swapStateVar = useMakeVarPersisted<SwapState>(
    {
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
    },
    'swapState'
  )

  const swapState = useReactiveVar(swapStateVar)
  const [needsToAcceptHighPI, setNeedsToAcceptHighPI] = useState(false)
  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')

  const { isConnected } = useUserAccount()
  const { getToken } = useTokens()
  const { hasValidationErrors } = useTokenInputsValidation()

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

  function resetSwapAmounts() {
    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        amount: '',
        scaledAmount: BigInt(0),
      },
      tokenOut: {
        ...swapState.tokenOut,
        amount: '',
        scaledAmount: BigInt(0),
      },
    })
  }

  function setDefaultTokens() {
    swapStateVar(getDefaultTokenState(swapState.selectedChain))
  }

  function replaceUrlPath() {
    const { selectedChain, tokenIn, tokenOut, swapType } = swapState
    const chainSlug = chainToSlugMap[selectedChain]
    const newPath = ['/swap']

    if (chainSlug) newPath.push(`/${chainSlug}`)
    if (tokenIn.address) newPath.push(`/${tokenIn.address}`)
    if (tokenIn.address && tokenOut.address) newPath.push(`/${tokenOut.address}`)
    if (
      tokenIn.address &&
      tokenOut.address &&
      tokenIn.amount &&
      swapType === GqlSorSwapType.ExactIn
    ) {
      newPath.push(`/${tokenIn.amount}`)
    }
    if (
      tokenIn.address &&
      tokenOut.address &&
      tokenOut.amount &&
      swapType === GqlSorSwapType.ExactOut
    ) {
      newPath.push(`/0/${tokenOut.amount}`)
    }

    window.history.replaceState({}, '', newPath.join(''))
  }

  function scaleTokenAmount(amount: string, token: GqlToken | undefined): bigint {
    if (amount === '') return parseUnits('0', 18)
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

  const swapAction: SwapAction = useMemo(() => {
    if (
      isWrapOrUnwrap(swapState.tokenIn.address, swapState.tokenOut.address, swapState.selectedChain)
    ) {
      const wrapType = getWrapType(
        swapState.tokenIn.address,
        swapState.tokenOut.address,
        swapState.selectedChain
      )
      return wrapType ? wrapType : OSwapAction.SWAP
    }

    return OSwapAction.SWAP
  }, [swapState.tokenIn.address, swapState.tokenOut.address, swapState.selectedChain])

  const swapStepConfigs = useSwapStepConfigs({
    action: swapAction,
    humanAmountIn: swapState.tokenIn.amount,
    tokenIn: tokenInInfo,
    selectedChain: swapState.selectedChain,
    vaultAddress,
    closeModal: previewModalDisclosure.onClose,
  })
  const { currentStep, currentStepIndex, useOnStepCompleted } = useIterateSteps(swapStepConfigs)

  // Set state on initial load
  useEffect(() => {
    resetSwapAmounts()

    const { chain, tokenIn, tokenOut, amountIn, amountOut } = pathParams

    if (chain && slugToChainMap[chain as ChainSlug]) {
      setSelectedChain(slugToChainMap[chain as ChainSlug])
    }
    if (tokenIn && isAddress(tokenIn)) setTokenIn(tokenIn as Address)
    if (tokenOut && isAddress(tokenOut)) setTokenOut(tokenOut as Address)
    if (amountIn && !amountOut && bn(amountIn).gt(0)) setTokenInAmount(amountIn as HumanAmount)
    else if (amountOut && bn(amountOut).gt(0)) setTokenOutAmount(amountOut as HumanAmount)

    if (!swapState.tokenIn.address && !swapState.tokenOut.address) setDefaultTokens()
  }, [])

  // When a new simulation is triggered, update the state
  useEffect(() => {
    if (simulationQuery.data) {
      handleSimulationResponse(simulationQuery.data)
    }
  }, [simulationQuery.data])

  // Check if tokenIn is a base wrap token and set tokenOut as the wrapped token.
  useEffect(() => {
    const wrapper = getWrapperForBaseToken(swapState.tokenIn.address, swapState.selectedChain)
    if (wrapper) setTokenOut(wrapper.wrappedToken)
  }, [swapState.tokenIn.address])

  // Check if tokenOut is a base wrap token and set tokenIn as the wrapped token.
  useEffect(() => {
    const wrapper = getWrapperForBaseToken(swapState.tokenOut.address, swapState.selectedChain)
    if (wrapper) setTokenIn(wrapper.wrappedToken)
  }, [swapState.tokenOut.address])

  // Update the URL path when the tokens change
  useEffect(() => {
    replaceUrlPath()
  }, [swapState.selectedChain, swapState.tokenIn, swapState.tokenOut, swapState.tokenIn.amount])

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [!validAmountOut, 'Invalid amount out'],
    [needsToAcceptHighPI, 'Accept high price impact first'],
    [hasValidationErrors, 'Invalid input'],
    [simulationQuery.isError, 'Error fetching swap'],
    [simulationQuery.isLoading, 'Fetching swap...']
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
    currentStep,
    currentStepIndex,
    swapStepConfigs,
    isNativeAssetIn,
    swapAction,
    useOnStepCompleted,
    setTokenSelectKey,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenIn,
    setTokenOut,
    switchTokens,
    setNeedsToAcceptHighPI,
  }
}

type Props = PropsWithChildren<{
  pathParams: PathParams
}>

export function SwapProvider({ pathParams, children }: Props) {
  const hook = _useSwap(pathParams)
  return <SwapContext.Provider value={hook}>{children}</SwapContext.Provider>
}

export const useSwap = (): UseSwapResponse => useMandatoryContext(SwapContext, 'Swap')
