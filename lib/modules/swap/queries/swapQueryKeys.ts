import { BuildSwapInputs, SimulateSwapInputs } from '../swap.types'

const baseKey = 'swap'

function simulateInputKey({ swapAmount, swapType, tokenIn, tokenOut, chain }: SimulateSwapInputs) {
  return `${swapAmount}:${swapType}:${tokenIn}:${tokenOut}:${chain}`
}

function buildInputKey({ account, chain, slippagePercent, simulateResponse }: BuildSwapInputs) {
  return `${account}:${chain}:${slippagePercent}:${JSON.stringify(simulateResponse)}`
}

export const swapQueryKeys = {
  simulation: (inputs: SimulateSwapInputs) =>
    [baseKey, 'simulation', simulateInputKey(inputs)] as const,
  build: (inputs: BuildSwapInputs) => [baseKey, 'build', buildInputKey(inputs)] as const,
}
