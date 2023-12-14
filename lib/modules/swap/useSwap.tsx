/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getNetworkConfig } from '@/lib/config/app.config'
import {
  GetSorSwapsDocument,
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useLazyQuery, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { isAddress } from 'viem'

export type UseSwapResponse = ReturnType<typeof _useSwap>
export const SwapContext = createContext<UseSwapResponse | null>(null)

type SwapState = {
  tokenIn: string
  tokenOut: string
  swapType: GqlSorSwapType
  swapAmount: string | null
  swapOptions: {
    maxPools: number
  }
}

const swapStateVar = makeVar<SwapState>({
  tokenIn: '',
  tokenOut: '',
  swapType: GqlSorSwapType.ExactIn,
  swapAmount: null,
  swapOptions: {
    maxPools: 8,
  },
})

export function _useSwap() {
  const swapState = useReactiveVar(swapStateVar)

  const [tokenInAmount, _setTokenInAmount] = useState<string>('')
  const [tokenOutAmount, _setTokenOutAmount] = useState<string>('')
  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const [selectedChain, setSelectedChain] = useState<GqlChain>(GqlChain.Mainnet)
  const [swapOutput, setSwapOutput] = useState<GetSorSwapsQuery['swaps']>()

  const networkConfig = getNetworkConfig(selectedChain)

  const shouldFetchSwap =
    isAddress(swapState.tokenIn) && isAddress(swapState.tokenOut) && swapState.swapType

  const [
    fetchSwapsQuery,
    { stopPolling: tradeStopPolling, startPolling, networkStatus, loading, error },
  ] = useLazyQuery(GetSorSwapsDocument, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  })

  async function fetchSwaps() {
    console.log('fetchSwaps')

    const state = swapStateVar()

    if (!shouldFetchSwap) return

    const { data } = await fetchSwapsQuery({
      fetchPolicy: 'no-cache',
      variables: {
        chain: selectedChain,
        tokenIn: state.tokenIn,
        tokenOut: state.tokenOut,
        swapType: state.swapType,
        swapAmount: state.swapAmount || '0',
        swapOptions: state.swapOptions,
      },
    })

    setSwapOutput(data?.swaps)
    setReturnAmount(data?.swaps, state.swapType)
  }

  function setReturnAmount(swap: GetSorSwapsQuery['swaps'] | undefined, swapType: GqlSorSwapType) {
    if (!swap) return

    if (swapType === GqlSorSwapType.ExactIn) {
      setTokenOutAmount(swap?.returnAmount || '0', { userTriggered: false })
    } else {
      setTokenInAmount(swap?.returnAmount || '0', { userTriggered: false })
    }
  }

  useEffect(() => {
    console.log('swapOutput', swapOutput)
  }, [swapOutput])

  useEffect(() => {
    console.log('swapState', swapState)
  }, [swapState])

  useEffect(() => {
    console.log('shouldFetchSwap', shouldFetchSwap)
  }, [shouldFetchSwap])

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

  function switchTokens() {
    swapStateVar({
      ...swapState,
      tokenIn: swapState.tokenOut,
      tokenOut: swapState.tokenIn,
    })
  }

  function setTokenInAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    _setTokenInAmount(amount)
    if (userTriggered) {
      swapStateVar({
        ...swapState,
        swapType: GqlSorSwapType.ExactIn,
        swapAmount: amount,
      })
      fetchSwaps()
    }
  }

  function setTokenOutAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    _setTokenOutAmount(amount)
    if (userTriggered) {
      swapStateVar({
        ...swapState,
        swapType: GqlSorSwapType.ExactOut,
        swapAmount: amount,
      })
      fetchSwaps()
    }
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

  const isLoading = loading
  const isDisabled = isLoading || !swapOutput || swapOutput.swaps.length === 0

  return {
    ...swapState,
    tokenInAmount,
    tokenOutAmount,
    tokenSelectKey,
    selectedChain,
    isLoading,
    isDisabled,
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
