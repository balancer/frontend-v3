/* eslint-disable react-hooks/exhaustive-deps */
import {
  TransactionLabels,
  TransactionStep2,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { useEffect } from 'react'
import { useAddLiquidity } from './useAddLiquidity'
import { usePool } from '../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/TransactionStepsProvider'

export function useAddLiquidityStep(): TransactionStep2 {
  const { chainId } = usePool()
  const { getTransaction } = useTransactionSteps()

  const labels: TransactionLabels = {
    init: 'Add liquidity',
    title: 'Add liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity added to pool!`,
    tooltip: 'Add liquidity to pool.',
  }

  const { simulationQuery } = useAddLiquidity()
  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery()

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
    if (simulationQuery.data) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

  const gasEstimationMeta = sentryMetaForWagmiSimulation('Error in AddLiquidity gas estimation', {
    simulationQueryData: simulationQuery.data,
    buildCallQueryData: buildCallDataQuery.data,
  })

  const id = 'add-liquidity'

  const transaction = getTransaction(id)

  const isComplete = () => transaction?.result.isSuccess || false

  return {
    id,
    stepType: 'addLiquidity',
    labels,
    isComplete,
    renderAction: () => (
      <ManagedSendTransactionButton
        id={id}
        labels={labels}
        chainId={chainId}
        txConfig={buildCallDataQuery.data}
        gasEstimationMeta={gasEstimationMeta}
      />
    ),
  }
}
