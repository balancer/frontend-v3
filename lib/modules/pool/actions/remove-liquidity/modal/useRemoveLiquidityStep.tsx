/* eslint-disable react-hooks/exhaustive-deps */
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { RemoveLiquidityBuildQueryResponse } from '../queries/useRemoveLiquidityBuildCallDataQuery'
import { useMemo } from 'react'
import { usePool } from '../../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { RemoveLiquiditySimulationQueryResult } from '../queries/useRemoveLiquiditySimulationQuery'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'

export const removeLiquidityStepId = 'remove-liquidity'

export function useRemoveLiquidityStep(
  simulationQuery: RemoveLiquiditySimulationQueryResult,
  buildCallDataQuery: RemoveLiquidityBuildQueryResponse
): TransactionStep {
  const { chainId, refetch: refetchPoolUserBalances } = usePool()
  const { getTransaction } = useTransactionState()

  const labels: TransactionLabels = {
    init: 'Remove liquidity',
    title: 'Remove liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity removed from pool!`,
    tooltip: 'Remove liquidity from pool.',
  }

  const gasEstimationMeta = sentryMetaForWagmiSimulation(
    'Error in RemoveLiquidity gas estimation',
    {
      simulationQueryData: simulationQuery.data,
      buildCallQueryData: buildCallDataQuery.data,
    }
  )

  const transaction = getTransaction(removeLiquidityStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  return useMemo(
    () => ({
      id: removeLiquidityStepId,
      stepType: 'removeLiquidity',
      labels,
      isComplete,
      renderAction: () => (
        <ManagedSendTransactionButton
          id={removeLiquidityStepId}
          labels={labels}
          chainId={chainId}
          txConfig={buildCallDataQuery.data}
          gasEstimationMeta={gasEstimationMeta}
        />
      ),
      onSuccess: () => refetchPoolUserBalances(),
    }),
    [transaction, simulationQuery.data, buildCallDataQuery.data]
  )
}
