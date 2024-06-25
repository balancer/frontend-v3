import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'
import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useMemo } from 'react'
import { ClaimAllRewardsStepParams, useClaimAllRewardsStep } from './useClaimAllRewardsStep'

export function useClaimAllRewardsSteps(params: ClaimAllRewardsStepParams) {
  const { chain } = params.pools[0]

  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } =
    useApproveMinterStep(chain)

  const { step: claimAllRewardsStep, isLoading: isLoadingClaimAllRewards } =
    useClaimAllRewardsStep(params)

  const steps = useMemo((): TransactionStep[] => {
    const steps = [claimAllRewardsStep]
    if (params.balTokenRewardsQuery.balRewardsData.length > 0) {
      steps.unshift(minterApprovalStep)
    }
    return steps
  }, [claimAllRewardsStep, minterApprovalStep, params])

  return {
    isLoading: isLoadingMinterApprovalStep || isLoadingClaimAllRewards,
    steps,
  }
}
