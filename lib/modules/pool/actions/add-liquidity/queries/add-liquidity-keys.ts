import { Pool } from '../../../usePool'
import { requiresProportionalInput } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'

const addLiquidity = 'add-liquidity'

type LiquidityParams = {
  userAddress: string
  pool: Pool
  slippage: string
  humanAmountsIn: HumanAmountIn[]
}
function liquidityParams({ userAddress, pool, slippage, humanAmountsIn }: LiquidityParams) {
  return `${userAddress}:${pool.id}:${slippage}:${stringifyHumanAmountsIn(pool, humanAmountsIn)}`
}

function stringifyHumanAmountsIn(pool: Pool, humanAmountsIn: HumanAmountIn[]): string {
  if (humanAmountsIn.length === 0) return ''
  if (requiresProportionalInput(pool)) {
    /*
    This is an edge-case where we only use the first human amount in the array to avoid triggering queries when the other human amounts change automatically
    (as they are automatically calculated and entered in the proportional add liquidity flow).
    */
    return JSON.stringify(humanAmountsIn[0])
  }

  return JSON.stringify(humanAmountsIn)
}

export const addLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [addLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) => [addLiquidity, 'preview', liquidityParams(params)] as const,
  buildCallData: (params: LiquidityParams) =>
    [addLiquidity, 'buildCallData', liquidityParams(params)] as const,
}
