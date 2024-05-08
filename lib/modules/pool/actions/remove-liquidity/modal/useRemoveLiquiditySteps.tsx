/* eslint-disable react-hooks/exhaustive-deps */
import { useApproveRelayerStep } from '@/lib/modules/relayer/approveRelayerConfig'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { usePool } from '../../../usePool'
import { useSignRelayerStep } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { TransactionStep2 } from '@/lib/modules/transactions/transaction-steps/lib'
import { RemoveLiquiditySimulationQueryResult } from '../queries/useRemoveLiquiditySimulationQuery'
import { RemoveLiquidityBuildQueryResponse } from '../queries/useRemoveLiquidityBuildCallDataQuery'
import { useRemoveLiquidityStep } from './useRemoveLiquidityStep'
import { useMemo } from 'react'
import { shouldUseRecoveryRemoveLiquidity } from '../../LiquidityActionHelpers'

export function useRemoveLiquiditySteps(
  simulationQuery: RemoveLiquiditySimulationQueryResult,
  buildCallDataQuery: RemoveLiquidityBuildQueryResponse
): TransactionStep2[] {
  const relayerMode = useRelayerMode()
  const { chainId, pool } = usePool()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const signRelayerStep = useSignRelayerStep()
  const approveRelayerStep = useApproveRelayerStep(chainId)

  const removeLiquidityStep = useRemoveLiquidityStep(simulationQuery, buildCallDataQuery)

  return useMemo(() => {
    if (relayerMode === 'approveRelayer') {
      return [approveRelayerStep, removeLiquidityStep]
    } else if (shouldSignRelayerApproval && !shouldUseRecoveryRemoveLiquidity(pool)) {
      return [signRelayerStep, removeLiquidityStep]
    }

    return [removeLiquidityStep]
  }, [
    relayerMode,
    shouldSignRelayerApproval,
    removeLiquidityStep,
    approveRelayerStep,
    signRelayerStep,
  ])
}
