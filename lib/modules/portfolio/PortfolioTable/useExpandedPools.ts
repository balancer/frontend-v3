import { useMemo } from 'react'
import { Pool } from '../../pool/PoolProvider'
import { isVebalPool } from '../../pool/pool.helpers'

export enum ExpandedPoolType {
  Staked = 'staked',
  Unstaked = 'unstaked',
  Locked = 'locked',
  Unlocked = 'unlocked',
  Default = 'default',
}

export type ExpandedPoolInfo = Pool & {
  poolType: ExpandedPoolType
  poolPositionUsd: number
}

export function useExpandedPools(pools: Pool[]) {
  const expandedPools = useMemo(() => {
    const expandedPools: ExpandedPoolInfo[] = []

    pools.forEach(pool => {
      const isVeBal = isVebalPool(pool.id)

      const stakedBalanceUsd =
        pool.userBalance?.stakedBalances.reduce(
          (acc, balance) => acc + Number(balance.balanceUsd),
          0
        ) || 0
      const walletBalanceUsd = pool.userBalance?.walletBalanceUsd || 0

      if (stakedBalanceUsd > 0) {
        expandedPools.push({
          ...pool,
          poolType: isVeBal ? ExpandedPoolType.Locked : ExpandedPoolType.Staked,
          poolPositionUsd: stakedBalanceUsd,
        })
      }

      if (walletBalanceUsd > 0) {
        expandedPools.push({
          ...pool,
          poolType: isVeBal ? ExpandedPoolType.Unlocked : ExpandedPoolType.Unstaked,
          poolPositionUsd: walletBalanceUsd,
        })
      }

      if (stakedBalanceUsd === 0 && walletBalanceUsd === 0) {
        expandedPools.push({
          ...pool,
          poolType: ExpandedPoolType.Default,
          poolPositionUsd: 0,
        })
      }
    })

    return expandedPools
  }, [pools])

  return expandedPools
}
