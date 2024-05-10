/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import {
  TransactionLabels,
  addLiquidityStepId,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { useEffect } from 'react'
import { useAddLiquidity } from './useAddLiquidity'
import { usePool } from '../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useSyncTransactionFlowStep } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'

export function useConstructAddLiquidityStep() {
  const { chainId } = usePool()

  const transactionLabels: TransactionLabels = {
    init: 'Add liquidity',
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

  const addLiquidityTransaction = useManagedSendTransaction(
    transactionLabels,
    buildCallDataQuery.data,
    sentryMetaForWagmiSimulation('Error in AddLiquidity gas estimation', {
      simulationQueryData: simulationQuery.data,
      buildCallQueryData: buildCallDataQuery.data,
    })
  )

  const isComplete = () => addLiquidityTransaction.result.isSuccess

  const addLiquidityStep = useSyncTransactionFlowStep({
    ...addLiquidityTransaction,
    transactionLabels,
    id: addLiquidityStepId,
    stepType: 'addLiquidity',
    isComplete,
  })

  return {
    addLiquidityStep,
  }
}
