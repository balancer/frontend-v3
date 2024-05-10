import { getChainId } from '@/lib/config/app.config'
import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'
import { TransactionStep2 } from '@/lib/modules/transactions/transaction-steps/lib'
import { useMemo } from 'react'
import { PoolListItem } from '../../pool.types'
import { useClaimAllRewardsStep } from './useClaimAllRewardsStep'
import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'

export function useClaimAllRewardsSteps(pools: PoolListItem[]) {
  const { chain } = pools[0]
  const chainId = getChainId(chain)

  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)
  const approveRelayerStep = useApproveRelayerStep(chainId)
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } =
    useApproveMinterStep(chain)

  const { step: claimAllRewardsStep, isLoading: isLoadingClaimAllRewards } =
    useClaimAllRewardsStep(pools)

  const steps = useMemo((): TransactionStep2[] => {
    const _steps = [claimAllRewardsStep]
    if (!hasApprovedRelayer) _steps.unshift(approveRelayerStep)
    if (!hasMinterApproval) _steps.unshift(minterApprovalStep)
    return _steps
  }, [
    approveRelayerStep,
    claimAllRewardsStep,
    hasApprovedRelayer,
    hasMinterApproval,
    minterApprovalStep,
  ])

  return {
    isLoading: isLoadingMinterApprovalStep || isLoadingClaimAllRewards,
    steps,
  }
}
