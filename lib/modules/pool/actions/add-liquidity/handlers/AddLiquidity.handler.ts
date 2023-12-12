import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidityHelpers } from '../AddLiquidityHelpers'
import { AddLiquidityInputs, AddLiquidityOutputs, PriceImpactAmount } from '../add-liquidity.types'

/**
 * AddLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised
 * outputs. The outputs should not be return types from the SDK. This is to
 * allow handlers to be developed in the future that may not use the SDK.
 */
export abstract class AddLiquidityHandler {
  constructor(public readonly helpers: AddLiquidityHelpers) {}

  // Query the SDK for the expected output of adding liquidity
  abstract queryAddLiquidity(inputs: AddLiquidityInputs): Promise<AddLiquidityOutputs>
  // Calculate the price impact of adding liquidity
  abstract calculatePriceImpact(inputs: AddLiquidityInputs): Promise<number>
  // Build tx payload for adding liquidity
  abstract buildAddLiquidityTx(inputs: AddLiquidityInputs): Promise<TransactionConfig>

  abstract get queryKey(): string
}

export const NullPriceImpactAmount: PriceImpactAmount = {
  amount: 0n,
  bps: 0,
  decimal: 0,
  percentage: 0,
}
