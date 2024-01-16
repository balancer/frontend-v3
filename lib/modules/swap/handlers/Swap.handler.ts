import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'

/**
 * SwapHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 */
export interface SwapHandler {
  simulateSwap(humanAmountsIn: HumanAmountIn[]): Promise<QueryAddLiquidityOutput>
  buildSwapCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig>
}
