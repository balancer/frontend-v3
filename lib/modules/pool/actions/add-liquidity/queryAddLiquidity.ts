import { AddLiquidity } from '@balancer/sdk'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { HumanAmountIn } from './add-liquidity.types'
import { areEmptyAmounts } from './add-liquidity.helpers'

export async function queryAddLiquidity(
  addLiquidityBuilder: AddLiquidityConfigBuilder,
  humanAmountsIn: HumanAmountIn[]
) {
  if (areEmptyAmounts(humanAmountsIn)) {
    // Avoid query when there are no amounts in
    return null
  }
  const addLiquidityInput = addLiquidityBuilder.getAddLiquidityInputForSDK(humanAmountsIn)
  const poolStateInput2 = addLiquidityBuilder.poolStateInput

  const addLiquidity = new AddLiquidity()
  const queryResult = await addLiquidity.query(addLiquidityInput, poolStateInput2)
  return queryResult
}
