/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { parseUnits } from 'viem'
import { usePool } from '../../usePool'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'
import { useConstructGaugeWithdrawActionStep } from '@/lib/modules/gauge/gauge.actions'
import { BPT_DECIMALS } from '../../pool.constants'

export function useUnstaking() {
  const {
    isActiveStep: isFinalStepActive,
    activateStep: activateFinalStep,
    deactivateStep: deactivateFinalStep,
  } = useActiveStep()
  const { pool } = usePool()
  const { isConnected } = useUserAccount()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const stakedBalance = pool.userBalance?.stakedBalance || '0'

  /**
   * Transaction step construction
   */
  const stakeStep = useConstructGaugeWithdrawActionStep(
    pool.staking?.gauge,
    parseUnits(stakedBalance, BPT_DECIMALS)
  )

  return {
    isDisabled,
    disabledReason,
    steps: [stakeStep],
    isFinalStepActive,
    deactivateFinalStep,
  }
}
