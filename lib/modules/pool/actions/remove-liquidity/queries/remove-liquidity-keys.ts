const removeLiquidity = 'remove-liquidity'

type LiquidityParams = {
  userAddress: string
  poolId: string
  slippage: string
  bptIn: bigint
}
function liquidityParams({ userAddress, poolId, slippage, bptIn }: LiquidityParams) {
  return `${userAddress}:${poolId}:${slippage}:${bptIn}`
}
export const removeLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [removeLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) =>
    [removeLiquidity, 'preview', liquidityParams(params)] as const,
  buildCallData: (params: LiquidityParams) =>
    [removeLiquidity, 'buildTx', liquidityParams(params)] as const,
}
