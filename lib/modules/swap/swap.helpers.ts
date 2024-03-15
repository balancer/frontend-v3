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
