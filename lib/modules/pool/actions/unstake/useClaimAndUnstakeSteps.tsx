import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'
import { getChainId } from '@/lib/config/app.config'
import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useClaimAndUnstakeStep } from './useClaimAndUnstakeStep'
import { Pool } from '../../usePool'
import { useMemo } from 'react'
import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'

export function useClaimAndUnstakeSteps(pool: Pool): {
  isLoading: boolean
  steps: TransactionStep[]
} {
  const chainId = getChainId(pool.chain)

  const approveRelayerStep = useApproveRelayerStep(chainId)
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } = useApproveMinterStep(
    pool.chain
  )

  const { step: claimAndUnstakeStep, isLoading: isLoadingClaimAndUnstakeStep } =
    useClaimAndUnstakeStep(pool)

  const steps = useMemo((): TransactionStep[] => {
    return [minterApprovalStep, approveRelayerStep, claimAndUnstakeStep]
  }, [approveRelayerStep, claimAndUnstakeStep, minterApprovalStep])

  return {
    isLoading: isLoadingMinterApprovalStep || isLoadingClaimAndUnstakeStep,
    steps,
  }
}
