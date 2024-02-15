/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useIterateSteps } from '../useIterateSteps'
import { useClaimStepConfigs } from './useClaimStepConfigs'
import { Address } from 'viem'
import { Pool } from '../../usePool'

export function useClaiming(gaugeAddresses: Address[], pool: Pool) {
  const { isConnected } = useUserAccount()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const stepConfigs = useClaimStepConfigs(gaugeAddresses, pool)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  return {
    isDisabled,
    disabledReason,
    currentStep,
    useOnStepCompleted,
  }
}
