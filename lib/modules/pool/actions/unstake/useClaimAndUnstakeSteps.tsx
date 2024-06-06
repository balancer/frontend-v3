import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'
import { getChainId } from '@/lib/config/app.config'
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
  const chainId = getChainId(pool.chain)

  const { step: relayerApprovalStep, isLoading: isLoadingRelayerApprovalStep } =
    useApproveRelayerStep(chainId)
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } = useApproveMinterStep(
    pool.chain
  )

  const {
    step: claimAndUnstakeStep,
    isLoading: isLoadingClaimAndUnstakeStep,
    hasUnclaimedBalRewards,
  } = useClaimAndUnstakeStep(pool, refetchPoolBalances)

  const steps = useMemo((): TransactionStep[] => {
    const steps = [relayerApprovalStep, claimAndUnstakeStep]
    if (hasUnclaimedBalRewards) {
      steps.unshift(minterApprovalStep)
    }
    return steps
  }, [relayerApprovalStep, claimAndUnstakeStep, minterApprovalStep, hasUnclaimedBalRewards])

  return {
    isLoading:
      isLoadingMinterApprovalStep || isLoadingRelayerApprovalStep || isLoadingClaimAndUnstakeStep,
    steps,
  }
}
