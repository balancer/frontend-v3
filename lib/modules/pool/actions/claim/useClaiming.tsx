'use client'

import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { PoolListItem } from '../../pool.types'
import { useClaimAllRewardsSteps } from './useClaimAllRewardsSteps'
import { useClaimsData } from './useClaimsData'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useDisclosure } from '@chakra-ui/hooks'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { LABELS } from '@/lib/shared/labels'

export function useClaiming(pools: PoolListItem[]) {
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const claimsData = useClaimsData(pools)

  const {
    claimableBalancesQuery,
    balTokenRewardsQuery,
    isLoading: isLoadingData,
    ...claimsState
  } = claimsData

  const { steps, isLoading: isLoadingSteps } = useClaimAllRewardsSteps({
    pools,
    claimableBalancesQuery,
    balTokenRewardsQuery,
  })
  const transactionSteps = useTransactionSteps(steps, isLoadingSteps)

  const claimTxHash = transactionSteps.lastTransaction?.result?.data?.transactionHash

  return {
    isLoading: isLoadingData || isLoadingSteps,
    transactionSteps,
    claimTxHash,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    ...claimsState,
  }
}
