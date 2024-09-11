import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'
import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useMemo } from 'react'
import { ClaimAllRewardsStepParams, useClaimAllRewardsStep } from './useClaimAllRewardsStep'
import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'
import { getChainId } from '@/lib/config/app.config'

export function useClaimAllRewardsSteps(params: ClaimAllRewardsStepParams) {
  const pool = params.pools[0]
  if (!pool) {
    throw new Error('Pools should contain at least one element')
  }

  const { chain } = pool
  const chainId = getChainId(pool.chain)
  const hasBalTokenRewards = params.balTokenRewardsQuery.balRewardsData.length > 0

  const { step: relayerApprovalStep, isLoading: isLoadingRelayerApprovalStep } =
    useApproveRelayerStep(chainId)

  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } = useApproveMinterStep(
    chain,
    hasBalTokenRewards
  )

  const { step: claimAllRewardsStep, isLoading: isLoadingClaimAllRewards } =
    useClaimAllRewardsStep(params)

  const steps = useMemo((): TransactionStep[] => {
    const steps = [relayerApprovalStep, claimAllRewardsStep]

    if (hasBalTokenRewards) {
      steps.unshift(minterApprovalStep)
    }

    return steps
  }, [relayerApprovalStep, claimAllRewardsStep, minterApprovalStep, hasBalTokenRewards])

  return {
    isLoading:
      isLoadingRelayerApprovalStep || isLoadingMinterApprovalStep || isLoadingClaimAllRewards,
    steps,
  }
}
