import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useClaimAndUnstakeStep } from './useClaimAndUnstakeStep'
import { Pool } from '../../PoolProvider'
import { useMemo } from 'react'
import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'

export function useClaimAndUnstakeSteps(
  pool: Pool,
  refetchPoolBalances: () => void
): {
  isLoading: boolean
  steps: TransactionStep[]
} {
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } = useApproveMinterStep(
    pool.chain
  )

  const {
    step: claimAndUnstakeStep,
    hasPendingBalRewards,
    isLoading: isLoadingClaimAndUnstake,
  } = useClaimAndUnstakeStep(pool, refetchPoolBalances)

  const steps = useMemo((): TransactionStep[] => {
    const steps = [claimAndUnstakeStep]
    if (hasPendingBalRewards) {
      steps.unshift(minterApprovalStep)
    }
    return steps
  }, [claimAndUnstakeStep, minterApprovalStep, hasPendingBalRewards])

  return {
    isLoading: isLoadingMinterApprovalStep || isLoadingClaimAndUnstake,
    steps,
  }
}
