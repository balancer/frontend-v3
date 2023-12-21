import { HumanAmount } from '@balancer/sdk'

type Props = {
  queryId: string
  userAddress: string
  poolId: string
  slippage: string
  humanBptIn: HumanAmount | ''
}

// Should we share the same function for add and remove liquidity?
export function generateRemoveLiquidityQueryKey({
  queryId,
  userAddress,
  poolId,
  slippage,
  humanBptIn,
}: Props): string {
  return `'Remove_Liquidity:${queryId}:${userAddress}:${poolId}:${slippage}:${humanBptIn}`
}
