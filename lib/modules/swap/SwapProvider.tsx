'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import { getNetworkConfig } from '@/lib/config/app.config'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { LABELS } from '@/lib/shared/labels'
import { GqlChain, GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { bn } from '@/lib/shared/utils/numbers'
import { useDisclosure } from '@chakra-ui/react'
import { invert } from 'lodash'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { Address, Hash, isAddress, parseUnits } from 'viem'
import { ChainSlug, slugToChainMap } from '../pool/pool.utils'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { useTokenInputsValidation } from '../tokens/TokenInputsValidationProvider'
import { useTokens } from '../tokens/TokensProvider'
import { useUserAccount } from '../web3/UserAccountProvider'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { SwapState } from './swap.types'

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

export function _useSwap({ urlTxHash, ...pathParams }: PathParams) {
  const initialSwapState = {
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
  }

  const [swapState, setSwapState] = useState<SwapState>(initialSwapState)

  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const [initUserChain, setInitUserChain] = useState<GqlChain | undefined>(undefined)

  const { isConnected } = useUserAccount()
  const { chain: walletChain } = useNetworkConfig()
  const { getToken } = useTokens()
  const { tokens } = useTokenBalances()
  const { hasValidationErrors } = useTokenInputsValidation()

  const networkConfig = getNetworkConfig(swapState.selectedChain)
  const previewModalDisclosure = useDisclosure()

  const tokenInInfo = getToken(swapState.tokenIn.address, swapState.selectedChain)
  const tokenOutInfo = getToken(swapState.tokenOut.address, swapState.selectedChain)

  function setSelectedChain(_selectedChain: GqlChain) {
    const defaultTokenState = getDefaultTokenState(_selectedChain)
    setSwapState(defaultTokenState)
  }

  function setTokenIn(tokenAddress: Address) {
    const isSameAsTokenOut = isSameAddress(tokenAddress, swapState.tokenOut.address)

    setSwapState({
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

    setSwapState({
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
    setSwapState({
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
    const newState = {
      ...swapState,
      tokenIn: {
        ...swapState.tokenIn,
        amount,
        scaledAmount: scaleTokenAmount(amount, tokenInInfo),
      },
    }

    if (userTriggered) {
      setSwapState({
        ...newState,
        swapType: GqlSorSwapType.ExactIn,
      })
      setTokenOutAmount('', { userTriggered: false })
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from the other input.
      setSwapState(newState)
    }
  }

  function setTokenOutAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    const newState = {
      ...swapState,
      tokenOut: {
        ...swapState.tokenOut,
        amount,
        scaledAmount: scaleTokenAmount(amount, tokenOutInfo),
      },
    }

    if (userTriggered) {
      setSwapState({
        ...newState,
        swapType: GqlSorSwapType.ExactOut,
      })
      setTokenInAmount('', { userTriggered: false })
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from
      // the other input.
      setSwapState(newState)
    }
  }

  function getDefaultTokenState(chain: GqlChain) {
    const {
      tokens: { defaultSwapTokens },
    } = getNetworkConfig(chain)
    const { tokenIn, tokenOut } = defaultSwapTokens || {}

    return {
      swapType: GqlSorSwapType.ExactIn,
      selectedChain: chain,
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

  function setDefaultTokens() {
    setSwapState(getDefaultTokenState(swapState.selectedChain))
  }

  function scaleTokenAmount(amount: string, token: GqlToken | undefined): bigint {
    if (amount === '') return parseUnits('0', 18)
    if (!token) throw new Error('Cant scale amount without token metadata')
    return parseUnits(amount, token.decimals)
  }

  const validAmountOut = bn(swapState.tokenOut.amount).gt(0)

  function setInitialTokenIn(slugTokenIn?: string) {
    const { popularTokens } = networkConfig.tokens
    const symbolToAddressMap = invert(popularTokens || {}) as Record<string, Address>
    if (slugTokenIn) {
      if (isAddress(slugTokenIn)) setTokenIn(slugTokenIn as Address)
      else if (symbolToAddressMap[slugTokenIn] && isAddress(symbolToAddressMap[slugTokenIn])) {
        setTokenIn(symbolToAddressMap[slugTokenIn])
      }
    }
  }

  function setInitialTokenOut(slugTokenOut?: string) {
    const { popularTokens } = networkConfig.tokens
    const symbolToAddressMap = invert(popularTokens || {}) as Record<string, Address>
    if (slugTokenOut) {
      if (isAddress(slugTokenOut)) setTokenOut(slugTokenOut as Address)
      else if (symbolToAddressMap[slugTokenOut] && isAddress(symbolToAddressMap[slugTokenOut])) {
        setTokenOut(symbolToAddressMap[slugTokenOut])
      }
    }
  }

  function setInitialChain(slugChain?: string) {
    const _chain =
      slugChain && slugToChainMap[slugChain as ChainSlug]
        ? slugToChainMap[slugChain as ChainSlug]
        : walletChain

    setSelectedChain(_chain)
  }

  // Set state on initial load
  useEffect(() => {
    if (urlTxHash) return

    const { chain, tokenIn, tokenOut, amountIn, amountOut } = pathParams

    setInitialChain(chain)
    setInitialTokenIn(tokenIn)
    setInitialTokenOut(tokenOut)

    if (!swapState.tokenIn.address && !swapState.tokenOut.address) setDefaultTokens()
  }, [])

  // When wallet chain changes, update the swap form chain
  useEffect(() => {
    if (isConnected && initUserChain && walletChain !== swapState.selectedChain) {
      setSelectedChain(walletChain)
    } else if (isConnected) {
      setInitUserChain(walletChain)
    }
  }, [walletChain])

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [!validAmountOut, 'Invalid amount out'],
    [hasValidationErrors, 'Invalid input']
  )

  return {
    ...swapState,
    tokens,
    tokenInInfo,
    tokenOutInfo,
    tokenSelectKey,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    setTokenSelectKey,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenIn,
    setTokenOut,
    switchTokens,
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
