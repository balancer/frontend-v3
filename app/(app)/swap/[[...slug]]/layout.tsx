'use client'

import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { SwapProvider } from '@/lib/modules/swap/useSwap'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  params: { slug?: string[] }
}>

export default function SwapLayout({ params: { slug }, children }: Props) {
  const [chain, tokenIn, tokenOut, amountIn, amountOut] = slug ?? []

  const { getTokensByChain } = useTokens()
  const initChain = chain ? slugToChainMap[chain as ChainSlug] : GqlChain.Mainnet
  const initTokens = getTokensByChain(initChain)

  return (
    <TransactionStateProvider>
      <TokenInputsValidationProvider>
        <TokenBalancesProvider initTokens={initTokens}>
          <SwapProvider pathParams={{ chain, tokenIn, tokenOut, amountIn, amountOut }}>
            {children}
          </SwapProvider>
        </TokenBalancesProvider>
      </TokenInputsValidationProvider>
    </TransactionStateProvider>
  )
}
