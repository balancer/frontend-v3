import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { Pool } from '../../PoolProvider'
import { useMemo } from 'react'
import { useUnstakeFromNonPreferentialGaugeStep } from './useUnstakeFromNonPreferentialGaugeStep'
import { useStakeSteps } from '../stake/useStakeSteps'
import { HumanAmount } from '@balancer/sdk'

export function useRestakeSteps(
  pool: Pool,
  restakeAmount: HumanAmount,
  refetchPoolBalances: () => void
): {
  isLoading: boolean
  steps: TransactionStep[]
} {
  // Unstake from non preferential gauge
  const { step: unstakeStep } = useUnstakeFromNonPreferentialGaugeStep(pool, refetchPoolBalances)
  // Stake in preferential gauge
  const { steps: stakeSteps, isLoadingSteps } = useStakeSteps(pool, restakeAmount)

  const steps = useMemo((): TransactionStep[] => {
    const steps = [unstakeStep, ...stakeSteps]

    return steps
  }, [unstakeStep, stakeSteps])

  return {
    isLoading: isLoadingSteps,
    steps,
  }
}
