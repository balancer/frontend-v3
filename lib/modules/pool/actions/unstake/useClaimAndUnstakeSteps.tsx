import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'
import { getChainId } from '@/lib/config/app.config'
import { TransactionStep2 } from '@/lib/modules/transactions/transaction-steps/lib'
import { useClaimAndUnstakeStep } from './useClaimAndUnstakeStep'
import { Pool } from '../../usePool'
import { useMemo } from 'react'
import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'

export function useClaimAndUnstakeSteps(pool: Pool): {
  isLoading: boolean
  steps: TransactionStep2[]
} {
  const chainId = getChainId(pool.chain)

  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)
  const approveRelayerStep = useApproveRelayerStep(chainId)
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } = useApproveMinterStep(
    pool.chain
  )

  const { step: claimAndUnstakeStep, isLoading: isLoadingClaimAndUnstakeStep } =
    useClaimAndUnstakeStep(pool)

  const steps = useMemo((): TransactionStep2[] => {
    const _steps = [claimAndUnstakeStep]
    if (!hasApprovedRelayer) _steps.unshift(approveRelayerStep)
    if (!hasMinterApproval) _steps.unshift(minterApprovalStep)
    return _steps
  }, [
    approveRelayerStep,
    claimAndUnstakeStep,
    hasApprovedRelayer,
    hasMinterApproval,
    minterApprovalStep,
  ])

  return {
    isLoading: isLoadingMinterApprovalStep || isLoadingClaimAndUnstakeStep,
    steps,
  }
}
