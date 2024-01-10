import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { HumanAmountIn } from '../../liquidity-types'
import {
  BuildAddLiquidityInputs,
  QueryAddLiquidityOutput,
  SupportedHandler,
} from '../add-liquidity.types'

/**
 * AddLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 *
 * The output type of the "query method" and the input type of the "build call data" are generic:
 * - Default handler types will interact with the SDK to query and build the call data for the transaction
 * - Edge case handlers (e.g. Twamm handler) will not interact with the SDK.
 */
export interface AddLiquidityHandler<Handler extends SupportedHandler> {
  // Query the expected output of adding liquidity
  queryAddLiquidity(humanAmountsIn: HumanAmountIn[]): Promise<QueryAddLiquidityOutput<Handler>>
  // Calculate the price impact of adding liquidity
  calculatePriceImpact(humanAmountsIn: HumanAmountIn[]): Promise<number>
  // Build tx payload for adding liquidity
  buildAddLiquidityCallData(inputs: BuildAddLiquidityInputs<Handler>): Promise<TransactionConfig>
}
