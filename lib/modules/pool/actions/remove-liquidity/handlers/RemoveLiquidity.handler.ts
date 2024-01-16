import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  QueryRemoveLiquidityInput,
  BuildRemoveLiquidityInput,
  QueryRemoveLiquidityOutput,
} from '../remove-liquidity.types'

/**
 * RemoveLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 * This is to allow handlers to be developed in the future that may not use the SDK.
 */
export interface RemoveLiquidityHandler {
  // Query the SDK for the expected output of removing liquidity
  queryRemoveLiquidity(inputs: QueryRemoveLiquidityInput): Promise<QueryRemoveLiquidityOutput>
  // Calculate the price impact of removing liquidity
  calculatePriceImpact(inputs: QueryRemoveLiquidityInput): Promise<number>
  /*
    Build tx callData payload for removing liquidity
    It is responsibility of the UI to avoid calling buildRemoveLiquidityCallData before the last queryRemoveLiquidity was finished
  */
  buildRemoveLiquidityCallData(inputs: BuildRemoveLiquidityInput): Promise<TransactionConfig>
}
