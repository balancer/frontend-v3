/* eslint-disable react-hooks/exhaustive-deps */
import {
  TransactionLabels,
  TransactionStep2,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { AddLiquidityBuildQueryResponse } from './queries/useAddLiquidityBuildCallDataQuery'
import { usePool } from '../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { AddLiquiditySimulationQueryResult } from './queries/useAddLiquiditySimulationQuery'
import { useMemo } from 'react'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export const addLiquidityStepId = 'add-liquidity'

export function useAddLiquidityStep(
  simulationQuery: AddLiquiditySimulationQueryResult,
  buildCallDataQuery: AddLiquidityBuildQueryResponse
): TransactionStep2 {
  const { chainId } = usePool()
  const { getTransaction } = useTransactionState()

  const labels: TransactionLabels = {
    init: 'Add liquidity',
    title: 'Add liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity added to pool!`,
    tooltip: 'Add liquidity to pool.',
  }

  const gasEstimationMeta = sentryMetaForWagmiSimulation('Error in AddLiquidity gas estimation', {
    simulationQueryData: simulationQuery.data,
    buildCallQueryData: buildCallDataQuery.data,
  })

  const transaction = getTransaction(addLiquidityStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  return useMemo(
    () => ({
      id: addLiquidityStepId,
      stepType: 'addLiquidity',
      labels,
      isComplete,
      renderAction: () => (
        <ManagedSendTransactionButton
          id={addLiquidityStepId}
          labels={labels}
          chainId={chainId}
          txConfig={buildCallDataQuery.data}
          gasEstimationMeta={gasEstimationMeta}
        />
      ),
    }),
    [transaction, simulationQuery.data, buildCallDataQuery.data]
  )
}
