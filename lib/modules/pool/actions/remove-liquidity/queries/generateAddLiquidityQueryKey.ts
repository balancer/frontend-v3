import { HumanAmountIn } from '../../liquidity-types'

type Props = {
  userAddress: string
  poolId: string
  slippage: string
  humanAmountsIn: HumanAmountIn[]
}

// Should we share the same function for add and remove liquidity?
export function generateRemoveLiquidityQueryKey({
  userAddress,
  poolId,
  slippage,
  humanAmountsIn,
}: Props): string {
  return `${userAddress}:${poolId}:${slippage}:${JSON.stringify(humanAmountsIn)}`
}
