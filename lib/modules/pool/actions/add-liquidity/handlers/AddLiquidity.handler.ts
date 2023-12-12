import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidityService } from '../AddLiquidityService'
import { AddLiquidityInputs, AddLiquidityOutputs, PriceImpactAmount } from '../add-liquidity.types'
import { HumanAmountInWithTokenInfo } from '../AddLiquidityFlowButton'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { Address } from 'wagmi'

/**
 * AddLiquidityHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised
 * outputs. The outputs should not be return types from the SDK. This is to
 * allow handlers to be developed in the future that may not use the SDK.
 */
export abstract class AddLiquidityHandler {
  constructor(public readonly service: AddLiquidityService) {}

  // Query the SDK for the expected output of adding liquidity
  abstract queryAddLiquidity(inputs: AddLiquidityInputs): Promise<AddLiquidityOutputs>
  // Calculate the price impact of adding liquidity
  abstract calculatePriceImpact(inputs: AddLiquidityInputs): Promise<number>
  // Build tx payload for adding liquidity
  abstract buildAddLiquidityTx(inputs: AddLiquidityInputs): Promise<TransactionConfig>

  abstract getAmountsToApprove(
    humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[]
  ): TokenAmountToApprove[]

  public get poolTokenAddresses(): Address[] {
    return this.service.poolStateInput.tokens.map(t => t.address)
  }

  abstract get queryKey(): string
}

export const NullPriceImpactAmount: PriceImpactAmount = {
  amount: 0n,
  bps: 0,
  decimal: 0,
  percentage: 0,
}
