import { BuildSwapInputs, SimulateSwapInputs } from '../swap.types'

const baseKey = 'swap'

function simulateInputKey({ swapAmount, swapType, tokenIn, tokenOut, chain }: SimulateSwapInputs) {
  return `${swapAmount}:${swapType}:${tokenIn}:${tokenOut}:${chain}`
}

type BuildKeyParams = Pick<
  BuildSwapInputs,
  'account' | 'chain' | 'slippagePercent' | 'simulateResponse'
>
function buildInputKey({ account, chain, slippagePercent, simulateResponse }: BuildKeyParams) {
  return `${account}:${chain}:${slippagePercent}:${JSON.stringify(simulateResponse)}`
}

export const swapQueryKeys = {
  simulation: (inputs: SimulateSwapInputs) =>
    [baseKey, 'simulation', simulateInputKey(inputs)] as const,
  build: (inputs: BuildKeyParams) => [baseKey, 'build', buildInputKey(inputs)] as const,
}
