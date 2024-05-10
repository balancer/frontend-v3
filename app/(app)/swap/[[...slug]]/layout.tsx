'use client'

import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { SwapProvider } from '@/lib/modules/swap/useSwap'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { PropsWithChildren, useMemo, useState } from 'react'

type Props = PropsWithChildren<{
  params: { slug?: string[] }
}>

export default function SwapLayout({ params: { slug }, children }: Props) {
  const [chain, tokenIn, tokenOut, amountIn, amountOut] = slug ?? []
  const initialChain = chain && slugToChainMap[chain as ChainSlug]
  const [selectedChain, setSelectedChain] = useState(initialChain || GqlChain.Mainnet)
  const { getTokensByChain } = useTokens()
  const selectedChainTokens = useMemo(
    () => getTokensByChain(selectedChain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedChain]
  )

  return (
    <TransactionStateProvider>
      <TokenInputsValidationProvider>
        <TokenBalancesProvider tokens={selectedChainTokens}>
          <SwapProvider
            pathParams={{ chain, tokenIn, tokenOut, amountIn, amountOut }}
            updateTokensProviderChain={setSelectedChain}
          >
            {children}
          </SwapProvider>
        </TokenBalancesProvider>
      </TokenInputsValidationProvider>
    </TransactionStateProvider>
  )
}
