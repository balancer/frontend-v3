import { SwapInputs } from '../handlers/Swap.handler'

const baseKey = 'swap'

function swapInputKey({ swapAmount, swapType, tokenIn, tokenOut, chain }: SwapInputs) {
  return `${swapAmount}:${swapType}:${tokenIn}:${tokenOut}:${chain}`
}

export const swapQueryKeys = {
  simulation: (inputs: SwapInputs) => [baseKey, 'simulation', swapInputKey(inputs)] as const,
}
