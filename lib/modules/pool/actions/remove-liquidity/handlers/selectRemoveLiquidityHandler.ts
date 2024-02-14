import { Pool } from '../../../usePool'
import { shouldUseNestedLiquidity } from '../../LiquidityActionHelpers'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { NestedProportionalRemoveLiquidityHandler } from './NestedProportionalRemoveLiquidity.handler'
import { ProportionalRemoveLiquidityHandler } from './ProportionalRemoveLiquidity.handler'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'
import { SingleTokenRemoveLiquidityHandler } from './SingleTokenRemoveLiquidity.handler'

export function selectRemoveLiquidityHandler(
  pool: Pool,
  kind: RemoveLiquidityType
): RemoveLiquidityHandler {
  // TODO: Depending on the pool attributes we will return a different handler
  // if (pool.id === 'TWAMM-example') {
  //   // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
  //   return new TwammRemoveLiquidityHandler(getChainId(pool.chain))
  // }
  if (shouldUseNestedLiquidity(pool) && kind === RemoveLiquidityType.Proportional) {
    return new NestedProportionalRemoveLiquidityHandler(pool)
  }
  if (kind === RemoveLiquidityType.Proportional) {
    return new ProportionalRemoveLiquidityHandler(pool)
  }
  if (kind === RemoveLiquidityType.SingleToken) {
    return new SingleTokenRemoveLiquidityHandler(pool)
  }

  // Default type
  return new ProportionalRemoveLiquidityHandler(pool)
}
