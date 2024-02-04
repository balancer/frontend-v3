import { getChainId } from '@/lib/config/app.config'
import { Pool } from '../../../usePool'
import { TwammAddLiquidityHandler } from './TwammAddLiquidity.handler'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import { NestedAddLiquidityHandler } from './NestedAddLiquidity.handler'
import { shouldUseNestedLiquidity } from '../../LiquidityActionHelpers'

export function selectAddLiquidityHandler(pool: Pool) {
  let handler: AddLiquidityHandler
  if (pool.id === 'TWAMM-example') {
    // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
    handler = new TwammAddLiquidityHandler(getChainId(pool.chain))
  } else if (shouldUseNestedLiquidity(pool)) {
    handler = new NestedAddLiquidityHandler(pool)
  } else {
    handler = new UnbalancedAddLiquidityHandler(pool)
  }

  return handler
}
