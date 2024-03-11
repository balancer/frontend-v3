/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useIterateSteps } from '../../../transactions/transaction-steps/useIterateSteps'
import { useClaimAndUnstakeStepConfigs } from './useClaimAndUnstakeStepConfigs'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export function useUnstaking(chain: GqlChain) {
  const { isConnected } = useUserAccount()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const stepConfigs = useClaimAndUnstakeStepConfigs(chain)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return {
    isDisabled,
    disabledReason,
    currentStep,
    useOnStepCompleted,
  }
}
