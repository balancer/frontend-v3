/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

type SwapState = {
  tokenIn: string
  tokenOut: string
  swapType: GqlSorSwapType
  swapAmount: string | null
}

const swapStateVar = makeVar<SwapState>({
  tokenIn: '',
  tokenOut: '',
  swapType: GqlSorSwapType.ExactIn,
  swapAmount: null,
})

export function _useSwap() {
  const swapState = useReactiveVar(swapStateVar)

  const [tokenInAmount, _setTokenInAmount] = useState<string>('')
  const [tokenOutAmount, _setTokenOutAmount] = useState<string>('')
  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>()
  const [selectedChain, setSelectedChain] = useState<GqlChain>(GqlChain.Mainnet)

  const networkConfig = getNetworkConfig(selectedChain)

  function setTokenIn(tokenAddress: string) {
    swapStateVar({
      ...swapState,
      tokenIn: tokenAddress,
    })
  }

  function setTokenOut(tokenAddress: string) {
    swapStateVar({
      ...swapState,
      tokenOut: tokenAddress,
    })
  }

  function setSwapType(swapType: GqlSorSwapType) {
    swapStateVar({
      ...swapState,
      swapType,
    })
  }

  function setTokenInAmount(amount: string, userTriggered = true) {
    _setTokenInAmount(amount)
    if (userTriggered) setSwapType(GqlSorSwapType.ExactIn)
  }

  function setTokenOutAmount(amount: string, userTriggered = true) {
    _setTokenOutAmount(amount)
    if (userTriggered) setSwapType(GqlSorSwapType.ExactOut)
  }

  function setDefaultTokens() {
    const { tokenIn, tokenOut } = networkConfig.tokens.defaultSwapTokens || {}

    swapStateVar({
      ...swapState,
      tokenIn: tokenIn ? tokenIn : '',
      tokenOut: tokenOut ? tokenOut : '',
    })
  }

  // On first render, set default tokens
  useEffect(() => {
    setDefaultTokens()
  }, [])

  // On selected chain change, set default tokens
  useEffect(() => {
    setDefaultTokens()
  }, [selectedChain])

  useEffect(() => {
    console.log('swapState.swapType', swapState.swapType)
  }, [swapState.swapType])

  return {
    ...swapState,
    tokenInAmount,
    tokenOutAmount,
    tokenSelectKey,
    selectedChain,
    setTokenSelectKey,
    setSelectedChain,
    setTokenInAmount,
    setTokenOutAmount,
    setTokenIn,
    setTokenOut,
    setSwapType,
  }
}

export function SwapProvider({ children }: PropsWithChildren) {
  const hook = _useSwap()
  return <SwapContext.Provider value={hook}>{children}</SwapContext.Provider>
}

export const useSwap = (): UseSwapResponse => useMandatoryContext(SwapContext, 'Swap')
