import { AddLiquidityHelpers } from './AddLiquidityHelpers'
import { buildUnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'

type AddLiquidityType = 'unbalanced' | 'nested'

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
