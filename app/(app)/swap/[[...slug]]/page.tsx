'use client'

import { SwapForm } from '@/lib/modules/swap/SwapForm'

type Props = {
  params: { slug?: string[] }
}

export default function SwapPage({ params: { slug } }: Props) {
  const tokenIn = slug?.[0]
  const tokenOut = slug?.[1]
  const amountIn = slug?.[2]

  return <SwapForm pathTokenIn={tokenIn} pathTokenOut={tokenOut} pathAmountIn={amountIn} />
}
