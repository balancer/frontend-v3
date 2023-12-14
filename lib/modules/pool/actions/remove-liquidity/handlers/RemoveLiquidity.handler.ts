import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  RemoveLiquidityInputs,
  RemoveLiquidityOutputs,
  BuildLiquidityInputs,
} from '../remove-liquidity.types'

/**
 * RemoveLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised
 * outputs. The outputs return agnostic mandatory generalized types + optional SDK types (see sdkQueryOutput).
 * This is to allow handlers to be developed in the future that may not use the SDK.
 */
export interface RemoveLiquidityHandler {
  // Query the SDK for the expected output of removing liquidity
  queryRemoveLiquidity(inputs: RemoveLiquidityInputs): Promise<RemoveLiquidityOutputs>
  // Calculate the price impact of removing liquidity
  // Build tx payload for removing liquidity
  buildRemoveLiquidityTx(inputs: BuildLiquidityInputs): Promise<TransactionConfig>
}
