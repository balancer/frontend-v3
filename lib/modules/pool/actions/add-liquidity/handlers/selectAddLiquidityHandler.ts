import { getChainId } from '@/lib/config/app.config'
import { Pool } from '../../../usePool'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import { TwammAddLiquidityHandler } from './TwammAddLiquidity.handler'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'

export function selectAddLiquidityHandler(pool: Pool) {
  // TODO: Depending on the pool attributes we will return a different handler
  let handler: AddLiquidityHandler
  if (pool.id === 'TWAMM-example') {
    // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
    handler = new TwammAddLiquidityHandler(getChainId(pool.chain))
  } else {
    handler = new UnbalancedAddLiquidityHandler(pool)
  }

  return handler
}
