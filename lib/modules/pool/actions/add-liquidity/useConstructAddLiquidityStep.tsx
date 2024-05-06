/* eslint-disable react-hooks/exhaustive-deps */
import {
  ManagedResult,
  TransactionLabels,
  TxStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { useEffect, useState } from 'react'
import { useAddLiquidity } from './useAddLiquidity'
import { usePool } from '../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'

export function useConstructAddLiquidityStep(): TxStep {
  const [transaction, setTransaction] = useState<ManagedResult>()
  const { chainId } = usePool()

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

  const isComplete = () => transaction?.result.isSuccess || false

  return {
    id: 'AddLiquidity',
    labels,
    transaction,
    isComplete,
    renderAction: () => (
      <ManagedSendTransactionButton
        labels={labels}
        chainId={chainId}
        txConfig={buildCallDataQuery.data}
        gasEstimationMeta={gasEstimationMeta}
        setTransaction={setTransaction}
      />
    ),
  }
}
