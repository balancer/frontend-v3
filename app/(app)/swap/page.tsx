'use client'

import { SwapForm } from '@/lib/modules/swap/SwapForm'
import { SwapProvider } from '@/lib/modules/swap/useSwap'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'

export default function SwapPage() {
  return (
    <TokenInputsValidationProvider>
      <SwapProvider>
        <SwapForm />
      </SwapProvider>
    </TokenInputsValidationProvider>
  )
}
