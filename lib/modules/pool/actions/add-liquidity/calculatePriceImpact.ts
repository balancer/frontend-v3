import { PriceImpact } from '@balancer/sdk'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { HumanAmountIn } from './add-liquidity.types'
import { areEmptyAmounts } from './add-liquidity.helpers'

// TODO: ask SDK team to expose PriceImpactAmount
export type PriceImpactAmount = Awaited<ReturnType<typeof PriceImpact.addLiquidityUnbalanced>>

export const NullPriceImpactAmount: PriceImpactAmount = {
  amount: 0n,
  bps: 0,
  decimal: 0,
  percentage: 0,
}

export async function calculatePriceImpact(
  addLiquidityConfigBuilder: AddLiquidityConfigBuilder,
  humanAmountsIn: HumanAmountIn[]
) {
  if (areEmptyAmounts(humanAmountsIn)) {
    // Avoid price impact calculation when there are no amounts in
    return NullPriceImpactAmount
  }

  const addLiquidityInput = addLiquidityConfigBuilder.getUnbalancedAddLiquidityInput({
    humanAmountsIn,
  })

  const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
    addLiquidityInput,
    addLiquidityConfigBuilder.poolStateInput
  )
  return priceImpactABA
}
