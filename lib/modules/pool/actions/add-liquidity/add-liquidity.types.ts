import { AddLiquidityQueryOutput, PriceImpact, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountIn } from '../liquidity-types'

// TODO: this type should be exposed by the SDK
export type PriceImpactAmount = Awaited<ReturnType<typeof PriceImpact.addLiquidityUnbalanced>>

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

export type BuildLiquidityInputs = {
  inputs: AddLiquidityInputs
}
