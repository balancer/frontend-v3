import { HumanAmountIn } from '../../liquidity-types'

const addLiquidity = 'add-liquidity'

type LiquidityParams = {
  userAddress: string
  poolId: string
  slippage: string
  humanAmountsIn: HumanAmountIn[]
  isBuildCallReady: boolean
}
function liquidityParams({
  userAddress,
  poolId,
  slippage,
  humanAmountsIn,
  isBuildCallReady = true,
}: LiquidityParams) {
  return `${userAddress}:${poolId}:${slippage}:${isBuildCallReady}:${JSON.stringify(
    humanAmountsIn
  )}`
}
export const addLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [addLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) => [addLiquidity, 'preview', liquidityParams(params)] as const,
  buildCallData: (params: LiquidityParams) =>
    [addLiquidity, 'buildCallData', liquidityParams(params)] as const,
  mixed: (params: LiquidityParams) => [addLiquidity, 'mixed', liquidityParams(params)] as const,
}
