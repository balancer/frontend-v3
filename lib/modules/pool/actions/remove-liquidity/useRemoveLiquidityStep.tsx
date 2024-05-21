/* eslint-disable react-hooks/exhaustive-deps */
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useEffect, useMemo, useState } from 'react'
import { usePool } from '../../usePool'
import {
  RemoveLiquidityBuildQueryParams,
  useRemoveLiquidityBuildCallDataQuery,
} from './queries/useRemoveLiquidityBuildCallDataQuery'

export const removeLiquidityStepId = 'remove-liquidity'

export type RemoveLiquidityStepParams = RemoveLiquidityBuildQueryParams

export function useRemoveLiquidityStep(params: RemoveLiquidityStepParams): TransactionStep {
  const [isStepActivated, setIsStepActivated] = useState(false)
  const { pool, refetch: refetchPoolUserBalances } = usePool()
  const { getTransaction } = useTransactionState()

  const { simulationQuery } = params

  const buildCallDataQuery = useRemoveLiquidityBuildCallDataQuery({
    ...params,
    enabled: isStepActivated,
  })

  const labels: TransactionLabels = {
    init: 'Remove liquidity',
    title: 'Remove liquidity',
    description: `Remove liquidity from ${pool.name || 'pool'}.`,
    confirming: 'Confirming remove...',
    confirmed: `Liquidity removed!`,
    tooltip: `Remove liquidity from ${pool.name || 'pool'}.`,
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

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by RemoveLiquidityTimeout
    if (simulationQuery.data && isStepActivated) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

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
          txConfig={buildCallDataQuery.data}
          gasEstimationMeta={gasEstimationMeta}
        />
      ),
      onActivated: () => setIsStepActivated(true),
      onDeactivated: () => setIsStepActivated(false),
      onSuccess: () => refetchPoolUserBalances(),
    }),
    [transaction, simulationQuery.data, buildCallDataQuery.data]
  )
}
