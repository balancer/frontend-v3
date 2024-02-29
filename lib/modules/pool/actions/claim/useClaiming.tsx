/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useIterateSteps } from '../useIterateSteps'
import { useClaimStepConfigs } from './useClaimStepConfigs'
import { useDisclosure } from '@chakra-ui/hooks'
import { useBalTokenRewards } from '@/lib/modules/portfolio/useBalRewards'
import { useClaimableBalances } from '@/lib/modules/portfolio/claim/useClaimableBalances'
import { PoolListItem } from '../../pool.types'

export function useClaiming(pool: PoolListItem) {
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const { claimableRewards: nonBalRewards, refetchClaimableRewards } = useClaimableBalances([pool])
  const { balRewardsData: balRewards, refetchBalRewards } = useBalTokenRewards([pool])

  const hasNoRewards = !nonBalRewards.length && !balRewards.length

  const stepConfigs = useClaimStepConfigs(pool)
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
