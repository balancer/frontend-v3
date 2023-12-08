import { PriceImpact } from '@balancer/sdk'
import { AddLiquidityService } from './AddLiquidityService'
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
  AddLiquidityService: AddLiquidityService,
  humanAmountsIn: HumanAmountIn[]
) {
  if (areEmptyAmounts(humanAmountsIn)) {
    // Avoid price impact calculation when there are no amounts in
    return NullPriceImpactAmount
  }

  const addLiquidityInput = AddLiquidityService.getUnbalancedAddLiquidityInput({
    humanAmountsIn,
  })

  const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
    addLiquidityInput,
    AddLiquidityService.poolStateInput
  )
  return priceImpactABA
}
