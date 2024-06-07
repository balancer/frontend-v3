'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { ApolloClient, useApolloClient, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address, Hash, isAddress, parseUnits } from 'viem'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { useUserAccount } from '../web3/UserAccountProvider'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { DefaultSwapHandler } from './handlers/DefaultSwap.handler'
import { bn } from '@/lib/shared/utils/numbers'
import { useSimulateSwapQuery } from './queries/useSimulateSwapQuery'
import { useTokens } from '../tokens/TokensProvider'
import { useDisclosure } from '@chakra-ui/react'
import { useSwapSteps } from './useSwapSteps'
import {
  OSwapAction,
  SdkSimulateSwapResponse,
  SimulateSwapResponse,
  SwapAction,
  SwapState,
} from './swap.types'
import { SwapHandler } from './handlers/Swap.handler'
import { isSameAddress, selectByAddress } from '@/lib/shared/utils/addresses'
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
import { useTokenInputsValidation } from '../tokens/TokenInputsValidationProvider'
import { useMakeVarPersisted } from '@/lib/shared/hooks/useMakeVarPersisted'
import { HumanAmount } from '@balancer/sdk'
import { ChainSlug, chainToSlugMap, slugToChainMap } from '../pool/pool.utils'
import { invert } from 'lodash'
import { useTransactionSteps } from '../transactions/transaction-steps/useTransactionSteps'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { usePriceImpact } from '../price-impact/PriceImpactProvider'
import { calcMarketPriceImpact } from '../price-impact/price-impact.utils'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

export type PathParams = {
  chain?: string
  tokenIn?: string
  tokenOut?: string
  amountIn?: string
  amountOut?: string
  // When urlTxHash is present the rest of the params above are not used
  urlTxHash?: Hash
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

export function _useSwap({ urlTxHash, ...pathParams }: PathParams) {
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
  const { chain: walletChain } = useNetworkConfig()
  const { getToken, getTokensByChain, usdValueForToken } = useTokens()
  const { tokens, setTokens } = useTokenBalances()
  const { hasValidationErrors } = useTokenInputsValidation()
  const { setPriceImpact, setPriceImpactLevel } = usePriceImpact()

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

  const tokenInUsd = usdValueForToken(tokenInInfo, swapState.tokenIn.amount)
  const tokenOutUsd = usdValueForToken(tokenOutInfo, swapState.tokenOut.amount)

  const shouldFetchSwap = (state: SwapState, urlTxHash?: Hash) => {
    if (urlTxHash) return false
    return (
      isAddress(state.tokenIn.address) &&
      isAddress(state.tokenOut.address) &&
      !!state.swapType &&
      bn(getSwapAmount(swapState)).gt(0)
    )
  }

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
    enabled: shouldFetchSwap(swapState, urlTxHash),
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
    const isSameAsTokenOut = isSameAddress(tokenAddress, swapState.tokenOut.address)

    swapStateVar({
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        address: tokenAddress,
      },
      tokenOut: isSameAsTokenOut
        ? { ...swapState.tokenOut, address: emptyAddress }
        : swapState.tokenOut,
    })
  }

  function setTokenOut(tokenAddress: Address) {
    const isSameAsTokenIn = isSameAddress(tokenAddress, swapState.tokenIn.address)

    swapStateVar({
      ...swapState,
      tokenOut: {
        ...swapState.tokenOut,
        address: tokenAddress,
      },
      tokenIn: isSameAsTokenIn
        ? { ...swapState.tokenIn, address: emptyAddress }
        : swapState.tokenIn,
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
    const { popularTokens } = networkConfig.tokens
    const chainSlug = chainToSlugMap[selectedChain]
    const newPath = ['/swap']

    const _tokenIn = selectByAddress(popularTokens || {}, tokenIn.address) || tokenIn.address
    const _tokenOut = selectByAddress(popularTokens || {}, tokenOut.address) || tokenOut.address

    if (chainSlug) newPath.push(`/${chainSlug}`)
    if (_tokenIn) newPath.push(`/${_tokenIn}`)
    if (_tokenIn && _tokenOut) newPath.push(`/${_tokenOut}`)
    if (_tokenIn && _tokenOut && tokenIn.amount && swapType === GqlSorSwapType.ExactIn) {
      newPath.push(`/${tokenIn.amount}`)
    }
    if (_tokenIn && _tokenOut && tokenOut.amount && swapType === GqlSorSwapType.ExactOut) {
      newPath.push(`/0/${tokenOut.amount}`)
    }

    window.history.replaceState({}, '', newPath.join(''))
  }

  function scaleTokenAmount(amount: string, token: GqlToken | undefined): bigint {
    if (amount === '') return parseUnits('0', 18)
    if (!token) throw new Error('Cant scale amount without token metadata')
    return parseUnits(amount, token.decimals)
  }

  const wethIsEth =
    isSameAddress(swapState.tokenIn.address, networkConfig.tokens.nativeAsset.address) ||
    isSameAddress(swapState.tokenOut.address, networkConfig.tokens.nativeAsset.address)
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

  const isWrap = swapAction === 'wrap' || swapAction === 'unwrap'

  /**
   * Step construction
   */
  const { steps, isLoadingSteps } = useSwapSteps({
    vaultAddress,
    swapState,
    handler,
    simulationQuery,
    wethIsEth,
    swapAction,
    tokenInInfo,
    tokenOutInfo,
  })

  const transactionSteps = useTransactionSteps(steps, isLoadingSteps)

  const swapTxHash = urlTxHash || transactionSteps.lastTransaction?.result?.data?.transactionHash

  const hasQuoteContext = !!simulationQuery.data

  // Set state on initial load
  useEffect(() => {
    resetSwapAmounts()
    if (urlTxHash) return

    const { chain, tokenIn, tokenOut, amountIn, amountOut } = pathParams
    const { popularTokens } = networkConfig.tokens
    const symbolToAddressMap = invert(popularTokens || {}) as Record<string, Address>
    const _chain =
      chain && slugToChainMap[chain as ChainSlug] ? slugToChainMap[chain as ChainSlug] : walletChain

    setSelectedChain(_chain)

    if (tokenIn) {
      if (isAddress(tokenIn)) setTokenIn(tokenIn as Address)
      else if (symbolToAddressMap[tokenIn] && isAddress(symbolToAddressMap[tokenIn])) {
        setTokenIn(symbolToAddressMap[tokenIn])
      }
    }
    if (tokenOut) {
      if (isAddress(tokenOut)) setTokenOut(tokenOut as Address)
      else if (symbolToAddressMap[tokenOut] && isAddress(symbolToAddressMap[tokenOut])) {
        setTokenOut(symbolToAddressMap[tokenOut])
      }
    }
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

    // If the token in address changes we should reset tx step index because
    // the first approval may be different.
    transactionSteps.setCurrentStepIndex(0)
  }, [swapState.tokenIn.address])

  // Check if tokenOut is a base wrap token and set tokenIn as the wrapped token.
  useEffect(() => {
    const wrapper = getWrapperForBaseToken(swapState.tokenOut.address, swapState.selectedChain)
    if (wrapper) setTokenIn(wrapper.wrappedToken)
  }, [swapState.tokenOut.address])

  // Update the URL path when the tokens change
  useEffect(() => {
    if (!swapTxHash) replaceUrlPath()
  }, [swapState.selectedChain, swapState.tokenIn, swapState.tokenOut, swapState.tokenIn.amount])

  // Update selecteable tokens when the chain changes
  useEffect(() => {
    setTokens(getTokensByChain(swapState.selectedChain))
  }, [swapState.selectedChain])

  // Open the preview modal when a swap tx hash is present
  useEffect(() => {
    if (swapTxHash) {
      previewModalDisclosure.onOpen()
    }
  }, [swapTxHash])

  // Set price impact when value of token in or out changes.
  useEffect(() => {
    if (!bn(tokenInUsd).isZero() && !bn(tokenOutUsd).isZero()) {
      setPriceImpact(calcMarketPriceImpact(tokenInUsd, tokenOutUsd))
    } else if (simulationQuery.data) {
      setPriceImpact(undefined)
      setPriceImpactLevel('unknown')
    }
  }, [tokenInUsd, tokenOutUsd])

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
    transactionSteps,
    tokens,
    tokenInInfo,
    tokenOutInfo,
    tokenSelectKey,
    simulationQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    handler,
    wethIsEth,
    swapAction,
    urlTxHash,
    swapTxHash,
    hasQuoteContext,
    isWrap,
    resetSwapAmounts,
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
