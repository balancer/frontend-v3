import { useApproveRelayerStep } from '@/lib/modules/relayer/useApproveRelayerStep'
import { getChainId } from '@/lib/config/app.config'
import { TransactionStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { UnstakeParams, useClaimAndUnstakeStep } from './useClaimAndUnstakeStep'

import { useMemo } from 'react'
import { useApproveMinterStep } from '@/lib/modules/staking/gauge/useMinterApprovalStep'

export function useClaimAndUnstakeSteps(unstakeParams: UnstakeParams): {
  isLoading: boolean
  steps: TransactionStep[]
} {
  const pool = unstakeParams.pool
  const chainId = getChainId(pool.chain)

  const { step: relayerApprovalStep, isLoading: isLoadingRelayerApprovalStep } =
    useApproveRelayerStep(chainId)
  const { step: minterApprovalStep, isLoading: isLoadingMinterApprovalStep } = useApproveMinterStep(
    pool.chain
  )

  const { step: claimAndUnstakeStep, isLoading: isLoadingClaimAndUnstakeStep } =
    useClaimAndUnstakeStep(unstakeParams)

  const steps = useMemo((): TransactionStep[] => {
    return [minterApprovalStep, relayerApprovalStep, claimAndUnstakeStep]
  }, [relayerApprovalStep, claimAndUnstakeStep, minterApprovalStep])

  return {
    isLoading:
      isLoadingMinterApprovalStep || isLoadingRelayerApprovalStep || isLoadingClaimAndUnstakeStep,
    steps,
  }
}
