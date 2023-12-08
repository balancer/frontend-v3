import { HumanAmount, PriceImpact, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

// TODO: ask SDK team to expose PriceImpactAmount
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
