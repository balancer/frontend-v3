import { AddLiquidityHelpers } from './AddLiquidityHelpers'
import { UnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'

type AddLiquidityType = 'unbalanced' | 'nested'

export function buildAddLiquidityHandler(
  addLiquidityType: AddLiquidityType,
  helpers: AddLiquidityHelpers
) {
  switch (addLiquidityType) {
    case 'unbalanced':
      return new UnbalancedAddLiquidityHandler(helpers)
    default:
      return new UnbalancedAddLiquidityHandler(helpers)
  }
}
