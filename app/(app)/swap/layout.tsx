'use client'

import { SwapProvider } from '@/lib/modules/swap/useSwap'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { PropsWithChildren } from 'react'

export default function SwapLayout({ children }: PropsWithChildren) {
  return (
    <TokenInputsValidationProvider>
      <SwapProvider>{children}</SwapProvider>
    </TokenInputsValidationProvider>
  )
}
