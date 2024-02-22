import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { useUserAccount } from '../web3/useUserAccount'
import { PoolListItem } from '../pool/pool.types'
import { useMemo } from 'react'
import { useQuery as useApolloQuery } from '@apollo/client'
import { useProtocolRewards } from './useProtocolRewards'
import { ClaimableReward, useClaimableBalances } from './useClaimableBalances'
import { BalTokenReward, useBalTokenRewards } from './useBalRewards'
import { bn } from '@/lib/shared/utils/numbers'

export interface ClaimableBalanceResult {
  status: 'success' | 'error'
  result: bigint
}

export interface PoolRewardsData extends PoolListItem {
  balReward?: BalTokenReward
  claimableRewards?: ClaimableReward[]
}

export type PoolRewardsDataMap = Record<string, PoolRewardsData>

export function usePortfolio() {
  const { userAddress } = useUserAccount()

  const { data } = useApolloQuery(GetPoolsDocument, {
    variables: { where: { userAddress } },
    notifyOnNetworkStatusChange: true,
  })

  const portfolioData = useMemo(() => {
    const stakedPools: PoolListItem[] = []
    const unstakedPools: PoolListItem[] = []
    let userTotalBalance = bn(0)

    data?.pools.forEach(pool => {
      const stakedBalance = bn(pool.userBalance?.stakedBalance || 0)
      const poolTotalBalance = bn(pool.userBalance?.totalBalance || 0)
      const unstakedBalance = poolTotalBalance.minus(stakedBalance)
      const isStaked = stakedBalance.gt(0)
      const isUnstaked = unstakedBalance.gt(0)

      if (isStaked) {
        stakedPools.push(pool)
      }
      if (isUnstaked) {
        unstakedPools.push(pool)
      }

      userTotalBalance = userTotalBalance.plus(pool.userBalance?.totalBalanceUsd || 0)
    })
    return {
      stakedPools,
      unstakedPools,
      userTotalBalance,
    }
  }, [data?.pools])

  // Bal token rewards
  const { balRewardsData } = useBalTokenRewards(portfolioData.stakedPools || [])

  // Protocol rewards
  const { protocolRewardsData } = useProtocolRewards()

  // Other tokens rewards
  const { claimableRewards, claimableRewardsByPoolMap } = useClaimableBalances(
    portfolioData.stakedPools || []
  )

  const poolRewardsMap = useMemo(() => {
    return portfolioData.stakedPools?.reduce((acc: PoolRewardsDataMap, pool) => {
      const balReward = balRewardsData.find(r => r.pool.id === pool.id)
      const claimableReward = claimableRewardsByPoolMap[pool.id]

      acc[pool.id] = {
        ...pool,
      }

      if (balReward) acc[pool.id].balReward = balReward
      if (claimableReward) acc[pool.id].claimableRewards = claimableReward

      return acc
    }, {})
  }, [portfolioData.stakedPools, balRewardsData, claimableRewardsByPoolMap])

  return {
    portfolioData,
    balRewardsData,
    protocolRewardsData,
    claimableRewards,
    poolRewardsMap,
  }
}
