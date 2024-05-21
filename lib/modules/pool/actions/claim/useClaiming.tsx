/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useBalTokenRewards } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { useClaimableBalances } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useDisclosure } from '@chakra-ui/hooks'
import { PoolListItem } from '../../pool.types'
import { useClaimAllRewardsSteps } from './useClaimAllRewardsSteps'
import { safeSum } from '@/lib/shared/utils/numbers'

export function useClaiming(pools: PoolListItem[]) {
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const claimableBalancesQuery = useClaimableBalances(pools)
  const nonBalRewards = claimableBalancesQuery.claimableRewards
  const balTokenRewardsQuery = useBalTokenRewards(pools)
  const balRewards = balTokenRewardsQuery.balRewardsData

  const allClaimableRewards = [...balRewards, ...nonBalRewards]

  const totalClaimableUsd = safeSum(allClaimableRewards.map(reward => reward.fiatBalance))

  const hasNoRewards = !nonBalRewards.length && !balRewards.length

  const { steps, isLoading } = useClaimAllRewardsSteps({
    pools,
    claimableBalancesQuery,
    balTokenRewardsQuery,
  })
  const transactionSteps = useTransactionSteps(steps, isLoading)

  return {
    isLoading:
      claimableBalancesQuery.isLoadingClaimableRewards ||
      balTokenRewardsQuery.isLoadingBalRewards ||
      isLoading,
    transactionSteps,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    nonBalRewards,
    balRewards,
    allClaimableRewards,
    totalClaimableUsd,
    hasNoRewards,
    isLoading:
      claimableBalancesQuery.isLoadingClaimableRewards || balTokenRewardsQuery.isLoadingBalRewards,
  }
}
