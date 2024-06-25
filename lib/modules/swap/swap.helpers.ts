import { OSwapAction, SwapAction } from './swap.types'

export function swapActionPastTense(action: SwapAction): string {
  switch (action) {
    case OSwapAction.WRAP:
      return 'Wrapped'
    case OSwapAction.UNWRAP:
      return 'Unwrapped'
    case OSwapAction.SWAP:
      return 'Swapped'
    default:
      throw new Error('Unsupported swap action')
  }
}

const swapErrorPatterns = [
  {
    pattern: /must contain at least 1 path/,
    message: "There's not enough liquidity on Balancer connecting these tokens to route this swap.",
  },
]

export function parseSwapError(msg?: string): string {
  if (!msg) return 'Unknown error'
  const pattern = swapErrorPatterns.find(p => p.pattern.test(msg))
  return pattern ? pattern.message : msg
}
