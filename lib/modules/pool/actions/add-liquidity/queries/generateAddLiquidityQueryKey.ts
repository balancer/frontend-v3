import { HumanAmountIn } from '../../liquidity-types'

type Props = {
  userAddress: string
  poolId: string
  slippage: string
  humanAmountsIn: HumanAmountIn[]
}

export function generateAddLiquidityQueryKey({
  userAddress,
  poolId,
  slippage,
  humanAmountsIn,
}: Props): string {
  return `add-liquidity:${userAddress}:${poolId}:${slippage}:${JSON.stringify(humanAmountsIn)}`
}
