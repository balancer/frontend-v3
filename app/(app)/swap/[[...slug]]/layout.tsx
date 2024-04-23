'use client'

import { SwapProvider } from '@/lib/modules/swap/useSwap'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  params: { slug?: string[] }
}>

export default function SwapLayout({ params: { slug }, children }: Props) {
  const [chain, tokenIn, tokenOut, amountIn] = slug ?? []

  return (
    <TokenInputsValidationProvider>
      <SwapProvider pathParams={{ chain, tokenIn, tokenOut, amountIn }}>{children}</SwapProvider>
    </TokenInputsValidationProvider>
  )
}
