import { Pool } from '../../../usePool'
import {
  shouldUseNestedLiquidity,
  shouldUseRecoveryRemoveLiquidity,
} from '../../LiquidityActionHelpers'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { NestedProportionalRemoveLiquidityHandler } from './NestedProportionalRemoveLiquidity.handler'
import { NestedSingleTokenRemoveLiquidityHandler } from './NestedSingleTokenRemoveLiquidity.handler'
import { ProportionalRemoveLiquidityHandler } from './ProportionalRemoveLiquidity.handler'
import { RecoveryRemoveLiquidityHandler } from './RecoveryRemoveLiquidity.handler'
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

  if (shouldUseRecoveryRemoveLiquidity(pool)) {
    console.log('Recovery handler')
    return new RecoveryRemoveLiquidityHandler(pool)
  }

  if (shouldUseNestedLiquidity(pool) && kind === RemoveLiquidityType.Proportional) {
    console.log('NESTED PROPORTIONAL remove')
    return new NestedProportionalRemoveLiquidityHandler(pool)
  }
  if (shouldUseNestedLiquidity(pool) && kind === RemoveLiquidityType.SingleToken) {
    console.log('NESTED SINGLE remove')
    return new NestedSingleTokenRemoveLiquidityHandler(pool)
  }

  if (kind === RemoveLiquidityType.Proportional) {
    console.log('PROPORTIONAL remove')
    return new ProportionalRemoveLiquidityHandler(pool)
  }

  if (kind === RemoveLiquidityType.SingleToken) {
    console.log('SINGLE remove')
    return new SingleTokenRemoveLiquidityHandler(pool)
  }

  console.log('PROPORTIONAL remove')
  // Default type
  return new ProportionalRemoveLiquidityHandler(pool)
}
