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
import { Address, isAddress } from 'viem'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { useIsDisabledWithReason } from '@/lib/shared/hooks/useIsDisabledWithReason'
import { useUserAccount } from '../web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'

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
})

export function _useSwap() {
  const swapState = useReactiveVar(swapStateVar)

  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const [selectedChain, setSelectedChain] = useState<GqlChain>(GqlChain.Mainnet)
  const [swapOutput, setSwapOutput] = useState<GetSorSwapsQuery['swaps']>()

  const { isConnected } = useUserAccount()
  const networkConfig = getNetworkConfig(selectedChain)

  const shouldFetchSwap =
    isAddress(swapState.tokenIn.address) &&
    isAddress(swapState.tokenOut.address) &&
    !!swapState.swapType

  const [fetchSwapsQuery, { loading }] = useLazyQuery(GetSorSwapsDocument, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  })

  async function fetchSwaps() {
    const state = swapStateVar()

    if (!shouldFetchSwap) return

    console.log('fetchSwaps', state)

    const swapAmount =
      swapState.swapType === GqlSorSwapType.ExactIn ? state.tokenIn.amount : state.tokenOut.amount

    console.log('swapAmount', swapAmount)

    const { data } = await fetchSwapsQuery({
      fetchPolicy: 'no-cache',
      variables: {
        chain: selectedChain,
        tokenIn: state.tokenIn.address,
        tokenOut: state.tokenOut.address,
        swapType: state.swapType,
        swapAmount: swapAmount || '0',
        swapOptions: {
          maxPools: 8,
        },
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
    if (userTriggered) {
      swapStateVar({
        ...swapState,
        swapType: GqlSorSwapType.ExactIn,
        tokenIn: {
          ...swapState.tokenIn,
          amount,
        },
      })
      fetchSwaps()
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from the other input.
      swapStateVar({
        ...swapState,
        tokenIn: {
          ...swapState.tokenIn,
          amount,
        },
      })
    }
  }

  function setTokenOutAmount(
    amount: string,
    { userTriggered = true }: { userTriggered?: boolean } = {}
  ) {
    if (userTriggered) {
      swapStateVar({
        ...swapState,
        swapType: GqlSorSwapType.ExactOut,
        tokenOut: {
          ...swapState.tokenOut,
          amount,
        },
      })
      fetchSwaps()
    } else {
      // Sometimes we want to set the amount without triggering a fetch or
      // swapType change, like when we populate the amount after a change from the other input.
      swapStateVar({
        ...swapState,
        tokenOut: {
          ...swapState.tokenOut,
          amount,
        },
      })
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

  // On first render, set default tokens
  useEffect(() => {
    setDefaultTokens()
  }, [])

  // On selected chain change, set default tokens
  useEffect(() => {
    setDefaultTokens()
  }, [selectedChain])

  // When either token address changes, fetch swaps
  useEffect(() => {
    fetchSwaps()
  }, [swapState.tokenIn.address, swapState.tokenOut.address])

  const isLoading = loading

  const { isDisabled, disabledReason } = useIsDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [isLoading, 'Swap is loading'],
    [!swapOutput, 'Swap output is undefined'],
    [swapOutput?.swaps.length === 0, 'Swap output is empty']
  )

  return {
    ...swapState,
    tokenSelectKey,
    selectedChain,
    isLoading,
    isDisabled,
    disabledReason,
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
