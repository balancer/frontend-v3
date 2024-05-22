/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useBalTokenRewards } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { useClaimableBalances } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { PoolListItem } from '../../pool.types'
import { safeSum } from '@/lib/shared/utils/numbers'

export function useClaimsData(pools: PoolListItem[]) {
  const claimableBalancesQuery = useClaimableBalances(pools)
  const nonBalRewards = claimableBalancesQuery.claimableRewards
  const balTokenRewardsQuery = useBalTokenRewards(pools)
  const balRewards = balTokenRewardsQuery.balRewardsData

  const allClaimableRewards = [...balRewards, ...nonBalRewards]

  const totalClaimableUsd = safeSum(allClaimableRewards.map(reward => reward.fiatBalance))

  const hasNoRewards = !nonBalRewards.length && !balRewards.length

  return {
    isLoading:
      claimableBalancesQuery.isLoadingClaimableRewards || balTokenRewardsQuery.isLoadingBalRewards,
    nonBalRewards,
    balRewards,
    allClaimableRewards,
    totalClaimableUsd,
    hasNoRewards,
    claimableBalancesQuery,
    balTokenRewardsQuery,
  }
}
