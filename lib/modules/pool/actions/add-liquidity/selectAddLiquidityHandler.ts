import { Pool } from '../../usePool'
import { AddLiquidityHelpers } from './AddLiquidityHelpers'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'
import { buildUnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'

type AddLiquidityType = 'unbalanced' | 'nested'

export function selectAddLiquidityHandler(pool: Pool) {
  const helpers = new AddLiquidityHelpers(pool)
  // TODO: Depending on the pool attributes we will return a different handler
  let handler: AddLiquidityHandler
  if (pool) {
    handler = buildAddLiquidityHandler('unbalanced', helpers)
  } else {
    handler = buildAddLiquidityHandler('unbalanced', helpers)
  }

  return {
    handler,
    helpers,
  }
}

export function buildAddLiquidityHandler(
  addLiquidityType: AddLiquidityType,
  helpers: AddLiquidityHelpers
) {
  switch (addLiquidityType) {
    case 'unbalanced':
      return buildUnbalancedAddLiquidityHandler(helpers)
    default:
      return buildUnbalancedAddLiquidityHandler(helpers)
  }
}
