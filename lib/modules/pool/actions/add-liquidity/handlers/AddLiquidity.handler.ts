import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { HumanAmountIn } from '../../liquidity-types'
import { BuildAddLiquidityInput, QueryAddLiquidityOutput } from '../add-liquidity.types'
import { Address } from 'viem'

/**
 * AddLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 *
 * SDK handlers:
 * - Default handlers will interact with the SDK to query and build the call data for the transaction
 * - They store the response of the last query execution inside the handler instance so it can be used later by buildAddLiquidityCallData
 * - Each time queryAddLiquidity is called they update that internal state
 *
 * Edge-case handlers:
 * - Edge case handlers (e.g. Twamm handler) will not interact with the SDK
 * - They do not store the response of a SDK query but could store other state related to the edge-case implementation
 */
export interface AddLiquidityHandler {
  // Query the expected output of adding liquidity and store it inside the handler instance
  // Also returns bptOut to be used by the UI
  simulate(
    humanAmountsIn: HumanAmountIn[],
    // Only NestedAddLiquidity expects a userAddress
    // TODO: The sdk team is going to remove userAddress from the nested query signature to simplify this:
    // https://github.com/balancer/b-sdk/issues/209
    userAddress?: Address
  ): Promise<QueryAddLiquidityOutput>

  // Calculate the price impact of adding liquidity
  getPriceImpact(humanAmountsIn: HumanAmountIn[]): Promise<number>
  /*
    Build tx callData payload for adding liquidity
    It is responsibility of the UI to avoid calling buildAddLiquidityCallData before the last queryAddLiquidity was finished
  */
  buildCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig>
}
