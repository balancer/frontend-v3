/* eslint-disable react-hooks/exhaustive-deps */
import {
  getTransactionState,
  TransactionLabels,
  TransactionStep2,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { RemoveLiquidityBuildQueryResponse } from '../queries/useRemoveLiquidityBuildCallDataQuery'
import { useEffect, useMemo } from 'react'
import { usePool } from '../../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { RemoveLiquiditySimulationQueryResult } from '../queries/useRemoveLiquiditySimulationQuery'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'

const removeLiquidityId = 'remove-liquidity'

export function useRemoveLiquidityStep(
  simulationQuery: RemoveLiquiditySimulationQueryResult,
  buildCallDataQuery: RemoveLiquidityBuildQueryResponse
): TransactionStep2 {
  const { chainId, refetch: refetchPoolUserBalances } = usePool()
  const { getTransaction } = useTransactionState()

  const labels: TransactionLabels = {
    init: 'Remove liquidity',
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

  const transaction = getTransaction(removeLiquidityId)

  const isComplete = () => transaction?.result.isSuccess || false

  return useMemo(
    () => ({
      id: removeLiquidityId,
      stepType: 'removeLiquidity',
      labels,
      isComplete,
      renderAction: () => (
        <ManagedSendTransactionButton
          id={removeLiquidityId}
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
