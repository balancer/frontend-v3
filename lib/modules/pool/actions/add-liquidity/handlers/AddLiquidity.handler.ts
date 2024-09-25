import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidityQueryOutput, Permit2, PublicWalletClient } from '@balancer/sdk'
import { Address } from 'viem'
import { BuildAddLiquidityInput, QueryAddLiquidityOutput } from '../add-liquidity.types'
import { NoncesByTokenAddress } from '@/lib/modules/tokens/approvals/permit2/usePermit2Nonces'

export interface Permit2AddLiquidityInput {
  account: Address
  slippagePercent: string
  sdkQueryOutput: AddLiquidityQueryOutput
}

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
  simulate(humanAmountsIn: HumanTokenAmountWithAddress[]): Promise<QueryAddLiquidityOutput>

  // Calculate the price impact of adding liquidity
  getPriceImpact(humanAmountsIn: HumanTokenAmountWithAddress[]): Promise<number>
  /*
    Build tx callData payload for adding liquidity
    It is responsibility of the UI to avoid calling buildAddLiquidityCallData before the last queryAddLiquidity was finished
  */
  buildCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig>

  /* Sign permit2 for adding liquidity (for now only used by v3 pools)
     TODO: generalize for other handlers using permit2
  */
  signPermit2?(
    input: Permit2AddLiquidityInput,
    walletClient: PublicWalletClient,
    nonces?: NoncesByTokenAddress
  ): Promise<Permit2>
}
