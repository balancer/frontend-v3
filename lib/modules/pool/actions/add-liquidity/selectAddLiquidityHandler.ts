import { PoolStateInput } from '@balancer/sdk'
import { Pool } from '../../usePool'
import { AddLiquidityHelpers } from './AddLiquidityHelpers'
import { buildUnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'
import { SupportedChainId } from '@/lib/config/config.types'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'

type AddLiquidityType = 'unbalanced' | 'nested'

export type PoolData = {
  chainId: SupportedChainId
  pool: Pool
  poolStateInput: PoolStateInput
}

export function selectAddLiquidityHandler({ chainId, pool, poolStateInput }: PoolData) {
  const helpers = new AddLiquidityHelpers(chainId, poolStateInput)
  // TODO: Depending on the pool attributes we will return a different handler
  let handler: AddLiquidityHandler
  if (pool) {
    handler = buildAddLiquidityHandler('unbalanced', helpers)
  } else {
    handler = buildAddLiquidityHandler('unbalanced', helpers)
  }

  return { handler, getAmountsToApprove: helpers.getAmountsToApprove }
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
