import { getChainId } from '@/lib/config/app.config'
import { Pool } from '../../../PoolProvider'
import { TwammAddLiquidityHandler } from './TwammAddLiquidity.handler'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import { NestedAddLiquidityHandler } from './NestedAddLiquidity.handler'
import { requiresProportionalInput, supportsNestedActions } from '../../LiquidityActionHelpers'
import { ProportionalAddLiquidityHandler } from './ProportionalAddLiquidity.handler'
import { isV3Pool } from '../../../pool.helpers'
import { UnbalancedAddLiquidityHandlerV3 } from './UnbalancedAddLiquidityV3.handler'
import { ProportionalAddLiquidityHandlerV3 } from './ProportionalAddLiquidityV3.handler'

export function selectAddLiquidityHandler(pool: Pool): AddLiquidityHandler {
  // This is just an example to illustrate how edge-case handlers would receive different inputs but return a common contract
  if (pool.id === 'TWAMM-example') return new TwammAddLiquidityHandler(getChainId(pool.chain))

  // Only available in test api
  if (pool.id === '0x8fc07bcf9b88ace84c7523248dc4a85f638c9536') {
    console.log('ProportionalAddLiquidityHandlerV3')
    return new ProportionalAddLiquidityHandlerV3(pool)
  }

  if (requiresProportionalInput(pool.type)) {
    return new ProportionalAddLiquidityHandler(pool)
  }

  // TODO add && not toggled escape hatch to high level tokens
  // We should add a toggle to the form which allows the user to revert to
  // adding liquidity in the first level pool tokens.
  if (supportsNestedActions(pool)) {
    return new NestedAddLiquidityHandler(pool)
  }

  if (isV3Pool(pool)) return new UnbalancedAddLiquidityHandlerV3(pool)
  return new UnbalancedAddLiquidityHandler(pool)
}
