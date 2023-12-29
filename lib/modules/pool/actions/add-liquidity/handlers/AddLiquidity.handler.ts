import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  AddLiquidityInputs,
  AddLiquidityOutputs,
  BuildLiquidityInputs,
} from '../add-liquidity.types'

/**
 * AddLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 * The outputs should not be return types from the SDK. This is to
 * allow handlers to be developed in the future that may not use the SDK.
 */
export interface AddLiquidityHandler {
  // Query the SDK for the expected output of adding liquidity
  queryAddLiquidity(inputs: AddLiquidityInputs): Promise<AddLiquidityOutputs>
  // Calculate the price impact of adding liquidity
  calculatePriceImpact(inputs: AddLiquidityInputs): Promise<number>
  // Build tx payload for adding liquidity
  buildAddLiquidityCallData(inputs: BuildLiquidityInputs): Promise<TransactionConfig>
}
