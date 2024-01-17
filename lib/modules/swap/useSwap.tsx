/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { getNetworkConfig } from '@/lib/config/app.config'
import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useApolloClient, useReactiveVar } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address, isAddress } from 'viem'
import { emptyAddress } from '../web3/contracts/wagmi-helpers'
import { useUserAccount } from '../web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useDebouncedCallback } from 'use-debounce'
import { useCountdown } from 'usehooks-ts'
import { DefaultSwapHandler } from './handlers/DefaultSwap.handler'
import { SentryError, ensureError } from '@/lib/shared/utils/errors'
import { bn } from '@/lib/shared/utils/numbers'

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

// Unecessary for now but allows us to add logic to select other handlers in the future.
function selectSwapHandler() {
  return new DefaultSwapHandler()
}

export function _useSwap() {
  const swapState = useReactiveVar(swapStateVar)

  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')
  const [selectedChain, setSelectedChain] = useState<GqlChain>(GqlChain.Mainnet)
  const [swapOutput, setSwapOutput] = useState<GetSorSwapsQuery['swaps']>()
  const [isFetching, setIsFetching] = useState(false)

  const { isConnected } = useUserAccount()
  const networkConfig = getNetworkConfig(selectedChain)

  const handler = useMemo(() => selectSwapHandler(), [])
  const client = useApolloClient()

  const [refetchCountdownSecs, { startCountdown, resetCountdown, stopCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const shouldFetchSwap = (state: SwapState, swapAmount: string) =>
    isAddress(state.tokenIn.address) &&
    isAddress(state.tokenOut.address) &&
    !!state.swapType &&
    bn(swapAmount).gt(0)

  const getSwapAmount = (state: SwapState) =>
    (state.swapType === GqlSorSwapType.ExactIn ? state.tokenIn.amount : state.tokenOut.amount) ||
    '0'

  async function fetchSwap() {
    resetCountdown()
    stopCountdown()
    const state = swapStateVar()

    const swapAmount = getSwapAmount(state)

    if (!shouldFetchSwap(state, swapAmount)) {
      setReturnAmount(undefined, state.swapType)
      return
    }

    try {
      setIsFetching(true)

      const result = await handler.simulateSwap({
        apolloClient: client,
        chain: selectedChain,
        tokenIn: state.tokenIn.address,
        tokenOut: state.tokenOut.address,
        swapType: state.swapType,
        swapAmount: getSwapAmount(state),
      })

      setSwapOutput(result?.swaps)
      setReturnAmount(result?.swaps, state.swapType)
      startCountdown()
      setIsFetching(false)
    } catch (e) {
      const error = ensureError(e)
      console.log('error', error)

      throw new SentryError('Failed to fetch swap', {
        cause: error,
        context: {
          extra: {
            chain: selectedChain,
            ...state,
          },
        },
      })
    }
  }

  const debouncedFetchSwaps = useDebouncedCallback(fetchSwap, 300)

  function setReturnAmount(swap: GetSorSwapsQuery['swaps'] | undefined, swapType: GqlSorSwapType) {
    let returnAmount = ''

    if (swap) returnAmount = swap.returnAmount || '0'

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
      debouncedFetchSwaps()
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
      debouncedFetchSwaps()
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
    debouncedFetchSwaps()
  }, [swapState.tokenIn.address, swapState.tokenOut.address])

  // When refetchCountdownSecs reaches 0, refetch swaps
  useEffect(() => {
    if (refetchCountdownSecs === 0) {
      fetchSwap()
    }
  }, [refetchCountdownSecs])

  const isLoading = isFetching

  const { isDisabled, disabledReason } = isDisabledWithReason(
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
    refetchCountdownSecs,
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
