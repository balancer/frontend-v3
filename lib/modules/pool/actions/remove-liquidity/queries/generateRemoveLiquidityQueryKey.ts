import { HumanAmountIn } from '../../liquidity-types'

type Props = {
  queryId: string
  userAddress: string
  poolId: string
  slippage: string
  humanAmountsIn: HumanAmountIn[]
}

// Should we share the same function for add and remove liquidity?
export function generateRemoveLiquidityQueryKey({
  queryId,
  userAddress,
  poolId,
  slippage,
  humanAmountsIn,
}: Props): string {
  return `'Remove_Liquidity:${queryId}:${userAddress}:${poolId}:${slippage}:${JSON.stringify(
    humanAmountsIn
  )}`
}
