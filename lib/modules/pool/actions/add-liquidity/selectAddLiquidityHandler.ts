import { getChainId } from '@/lib/config/app.config'
import { Pool } from '../../usePool'
import { AddLiquidityHelpers } from './AddLiquidityHelpers'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'
import { buildTwammAddLiquidityHandler } from './handlers/TwammAddLiquidity.handler'
import { buildUnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'

export function selectAddLiquidityHandler(pool: Pool) {
  const helpers = new AddLiquidityHelpers(pool)
  // TODO: Depending on the pool attributes we will return a different handler
  let handler: AddLiquidityHandler
  if (pool.id === 'TWAMM-example') {
    // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
    handler = buildTwammAddLiquidityHandler(getChainId(pool.chain))
  } else {
    handler = buildUnbalancedAddLiquidityHandler(helpers)
  }

  return {
    handler,
    helpers,
  }
}
