import { Address } from 'viem'

const removeLiquidity = 'remove-liquidity'

type LiquidityParams = {
  userAddress: string
  poolId: string
  slippage: string
  bptIn: bigint
  tokenOut?: Address // only used by single token removal type
}
function liquidityParams({ userAddress, poolId, slippage, bptIn, tokenOut }: LiquidityParams) {
  return `${userAddress}:${poolId}:${slippage}:${bptIn}:${tokenOut}`
}
export const removeLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [removeLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) =>
    [removeLiquidity, 'preview', liquidityParams(params)] as const,
  buildCallData: (params: LiquidityParams) =>
    [removeLiquidity, 'buildCallData', liquidityParams(params)] as const,
}
