import { getChainId } from '@/lib/config/app.config'
import { Pool } from '../../usePool'
import { RemoveLiquidityHandler } from './handlers/RemoveLiquidity.handler'
import { TwammRemoveLiquidityHandler } from './handlers/TwammRemoveLiquidity.handler'
import { UnbalancedRemoveLiquidityHandler } from './handlers/UnbalancedRemoveLiquidity.handler'

export function selectRemoveLiquidityHandler(pool: Pool) {
  // TODO: Depending on the pool attributes we will return a different handler
  let handler: RemoveLiquidityHandler
  if (pool.id === 'TWAMM-example') {
    // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
    handler = new TwammRemoveLiquidityHandler(getChainId(pool.chain))
  } else {
    handler = new UnbalancedRemoveLiquidityHandler(pool)
  }

  return handler
}
