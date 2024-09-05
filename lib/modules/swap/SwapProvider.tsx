'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useDisclosure } from '@chakra-ui/react'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { Hash } from 'viem'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { useTokens } from '../tokens/TokensProvider'
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

  const [swapState] = useState<SwapState>(initialSwapState)

  const [tokenSelectKey, setTokenSelectKey] = useState<'tokenIn' | 'tokenOut'>('tokenIn')

  const { getToken } = useTokens()
  const { tokens } = useTokenBalances()

  const previewModalDisclosure = useDisclosure()

  const tokenInInfo = getToken(swapState.tokenIn.address, swapState.selectedChain)
  const tokenOutInfo = getToken(swapState.tokenOut.address, swapState.selectedChain)

  // Set state on initial load
  useEffect(() => {
    if (urlTxHash) return

    const { chain, tokenIn, tokenOut } = pathParams
    console.log({ chain, tokenIn, tokenOut })
  }, [])

  // // When wallet chain changes, update the swap form chain
  // useEffect(() => {
  //   if (isConnected && initUserChain && walletChain !== swapState.selectedChain) {
  //     setSelectedChain(walletChain)
  //   } else if (isConnected) {
  //     setInitUserChain(walletChain)
  //   }
  // }, [walletChain])

  return {
    ...swapState,
    tokens,
    tokenInInfo,
    tokenOutInfo,
    tokenSelectKey,
    previewModalDisclosure,
    setTokenSelectKey,
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
