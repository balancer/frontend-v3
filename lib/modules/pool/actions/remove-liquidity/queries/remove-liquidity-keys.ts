import { Address } from 'viem'
import { HumanAmount } from '@balancer/sdk'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'

const removeLiquidity = 'remove-liquidity'

function getHandlerClassName(instance: RemoveLiquidityHandler): string {
  return instance.constructor.name
}

type LiquidityParams = {
  handler: RemoveLiquidityHandler
  userAddress: string
  poolId: string
  slippage: string
  humanBptIn: HumanAmount
  tokenOut?: Address // only used by single token removal type
}
function liquidityParams({
  handler,
  userAddress,
  poolId,
  slippage,
  humanBptIn,
  tokenOut,
}: LiquidityParams) {
  return `${getHandlerClassName(
    handler
  )}:${userAddress}:${poolId}:${slippage}:${humanBptIn}:${tokenOut}`
}
export const removeLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [removeLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) =>
    [removeLiquidity, 'preview', liquidityParams(params)] as const,
  buildCallData: (params: LiquidityParams) =>
    [removeLiquidity, 'buildCallData', liquidityParams(params)] as const,
}
