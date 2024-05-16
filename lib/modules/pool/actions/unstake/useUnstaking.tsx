/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useClaimAndUnstakeSteps } from './useClaimAndUnstakeSteps'
import { Pool } from '../../usePool'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'

export function useUnstaking(pool: Pool) {
  const { isConnected } = useUserAccount()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const { steps, isLoading } = useClaimAndUnstakeSteps(pool)
  const transactionSteps = useTransactionSteps(steps, isLoading)

  return {
    transactionSteps,
    isDisabled,
    disabledReason,
  }
}
