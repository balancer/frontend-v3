import { Address } from 'viem'
import { HumanAmount } from '@balancer/sdk'
import { RemoveLiquidityHandlerType } from '../handlers/RemoveLiquidity.handler'

const removeLiquidity = 'remove-liquidity'

type LiquidityParams = {
  type: RemoveLiquidityHandlerType
  userAddress: string
  poolId: string
  slippage: string
  bptInUnits: HumanAmount
  tokenOut?: Address // only used by single token removal type
}
function liquidityParams({
  type,
  userAddress,
  poolId,
  slippage,
  bptInUnits,
  tokenOut,
}: LiquidityParams) {
  return `${type}:${userAddress}:${poolId}:${slippage}:${bptInUnits}:${tokenOut}`
}
export const removeLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [removeLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) =>
    [removeLiquidity, 'preview', liquidityParams(params)] as const,
  buildCallData: (params: LiquidityParams) =>
    [removeLiquidity, 'buildCallData', liquidityParams(params)] as const,
}
