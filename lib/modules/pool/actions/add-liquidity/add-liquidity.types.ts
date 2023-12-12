import { HumanAmount, PriceImpact, TokenAmount } from '@balancer/sdk'
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

export type AddLiquidityOutputs = {
  bptOut: TokenAmount
}
