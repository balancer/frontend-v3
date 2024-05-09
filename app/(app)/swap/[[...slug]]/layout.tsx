'use client'

import { SwapProvider } from '@/lib/modules/swap/useSwap'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  params: { slug?: string[] }
}>

export default function SwapLayout({ params: { slug }, children }: Props) {
  const [chain, tokenIn, tokenOut, amountIn, amountOut] = slug ?? []

  return (
    <TransactionStateProvider>
      <TokenInputsValidationProvider>
        <SwapProvider pathParams={{ chain, tokenIn, tokenOut, amountIn, amountOut }}>
          {children}
        </SwapProvider>
      </TokenInputsValidationProvider>
    </TransactionStateProvider>
  )
}
