import { SwapForm } from '@/lib/modules/swap/SwapForm'
import { SwapProvider } from '@/lib/modules/swap/useSwap'

export default function SwapPage() {
  return (
    <SwapProvider>
      <SwapForm />
    </SwapProvider>
  )
}
