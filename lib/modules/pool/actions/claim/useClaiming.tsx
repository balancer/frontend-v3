/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useIterateSteps } from '../../../transactions/transaction-steps/useIterateSteps'
import { useClaimStepConfigs } from './useClaimStepConfigs'
import { useDisclosure } from '@chakra-ui/hooks'
import { useBalTokenRewards } from '@/lib/modules/portfolio/PortfolioClaim/useBalRewards'
import { useClaimableBalances } from '@/lib/modules/portfolio/PortfolioClaim/useClaimableBalances'
import { PoolListItem } from '../../pool.types'

export function useClaiming(pools: PoolListItem[]) {
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const { claimableRewards: nonBalRewards, refetchClaimableRewards } = useClaimableBalances(pools)
  const { balRewardsData: balRewards, refetchBalRewards } = useBalTokenRewards(pools)

  const hasNoRewards = !nonBalRewards.length && !balRewards.length

  const stepConfigs = useClaimStepConfigs(pools)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return {
    isDisabled,
    disabledReason,
    currentStep,
    useOnStepCompleted,
    previewModalDisclosure,
    nonBalRewards,
    balRewards,
    refetchClaimableRewards,
    refetchBalRewards,
    hasNoRewards,
  }
}
