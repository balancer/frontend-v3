import { getChainId } from '@/lib/config/app.config'
import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'
import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useMemo } from 'react'
import { ClaimAllRewardsStepParams, useClaimAllRewardsStep } from './useClaimAllRewardsStep'
import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'

export function useClaimAllRewardsSteps(params: ClaimAllRewardsStepParams) {
  const { chain } = params.pools[0]
  const chainId = getChainId(chain)

  const approveRelayerStep = useApproveRelayerStep(chainId)
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } =
    useApproveMinterStep(chain)

  const { step: claimAllRewardsStep, isLoading: isLoadingClaimAllRewards } =
    useClaimAllRewardsStep(params)

  const steps = useMemo((): TransactionStep[] => {
    return [minterApprovalStep, approveRelayerStep, claimAllRewardsStep]
  }, [approveRelayerStep, claimAllRewardsStep, minterApprovalStep])

  return {
    isLoading: isLoadingMinterApprovalStep || isLoadingClaimAllRewards,
    steps,
  }
}
