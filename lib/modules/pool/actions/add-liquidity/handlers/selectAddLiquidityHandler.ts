import { getChainId } from '@/lib/config/app.config'
import { Pool } from '../../../usePool'
import { TwammAddLiquidityHandler } from './TwammAddLiquidity.handler'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import { NestedAddLiquidityHandler } from './NestedAddLiquidity.handler'
import { requiresProportionalInput, shouldUseNestedLiquidity } from '../../LiquidityActionHelpers'
import { ProportionalAddLiquidityHandler } from './ProportionalAddLiquidity.handler'

export function selectAddLiquidityHandler(pool: Pool): AddLiquidityHandler {
  // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
  if (pool.id === 'TWAMM-example') return new TwammAddLiquidityHandler(getChainId(pool.chain))

  if (requiresProportionalInput(pool.type)) {
    return new ProportionalAddLiquidityHandler(pool)
  }

  if (shouldUseNestedLiquidity(pool)) return new NestedAddLiquidityHandler(pool)

  return new UnbalancedAddLiquidityHandler(pool)
}
