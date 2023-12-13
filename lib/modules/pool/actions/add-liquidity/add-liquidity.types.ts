import { AddLiquidityQueryOutput, HumanAmount, PriceImpact, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

// TODO: this type should be exposed by the SDK
export type PriceImpactAmount = Awaited<ReturnType<typeof PriceImpact.addLiquidityUnbalanced>>

export type HumanAmountIn = {
  humanAmount: HumanAmount | ''
  tokenAddress: Address
}

export type AddLiquidityInputs = {
  humanAmountsIn: HumanAmountIn[]
  account?: Address
  slippagePercent?: string
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type AddLiquidityOutputs = {
  bptOut: TokenAmount
  sdkQueryOutput?: AddLiquidityQueryOutput
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type BuildLiquidityInputs = {
  inputs: AddLiquidityInputs
  sdkQueryOutput?: AddLiquidityQueryOutput
}
