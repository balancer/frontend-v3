import { HumanAmountIn } from '../../liquidity-types'

const addLiquidity = 'add-liquidity'

type LiquidityParams = {
  userAddress: string
  poolId: string
  slippage: string
  humanAmountsIn: HumanAmountIn[]
}
function liquidityParams({ userAddress, poolId, slippage, humanAmountsIn }: LiquidityParams) {
  return `${userAddress}:${poolId}:${slippage}:${JSON.stringify(humanAmountsIn)}`
}
export const addLiquidityKeys = {
  priceImpact: (params: LiquidityParams) =>
    [addLiquidity, 'price-impact', liquidityParams(params)] as const,
  preview: (params: LiquidityParams) => [addLiquidity, 'preview', liquidityParams(params)] as const,
  buildTx: (params: LiquidityParams) => [addLiquidity, 'buildTx', liquidityParams(params)] as const,
}
