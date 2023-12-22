type Props = {
  queryId: string
  userAddress: string
  poolId: string
  slippage: string
  bptIn: bigint
}

// Should we share the same function for add and remove liquidity?
export function generateRemoveLiquidityQueryKey({
  queryId,
  userAddress,
  poolId,
  slippage,
  bptIn,
}: Props): string {
  return `'Remove_Liquidity:${queryId}:${userAddress}:${poolId}:${slippage}:${bptIn}`
}
