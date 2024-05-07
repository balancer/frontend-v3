/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import {
  TransactionLabels,
  removeLiquidityStepId,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useRemoveLiquidityBuildCallDataQuery } from '../queries/useRemoveLiquidityBuildCallDataQuery'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { useEffect } from 'react'
import { useSyncCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'

export function useConstructRemoveLiquidityStep() {
  const transactionLabels: TransactionLabels = {
    init: 'Remove liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity removed from pool!`,
    tooltip: 'Remove liquidity from pool.',
  }

  const { simulationQuery } = useRemoveLiquidity()
  const buildCallDataQuery = useRemoveLiquidityBuildCallDataQuery()

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by RemoveLiquidityTimeout
    if (simulationQuery.data) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

  const removeLiquidityTransaction = useManagedSendTransaction(
    transactionLabels,
    buildCallDataQuery.data,
    sentryMetaForWagmiSimulation(
      'Error in RemoveLiquidity gas estimation',
      buildCallDataQuery.data || {}
    )
  )

  const isComplete = () => removeLiquidityTransaction.result.isSuccess

  const removeLiquidityStep = useSyncCurrentFlowStep({
    ...removeLiquidityTransaction,
    transactionLabels,
    id: removeLiquidityStepId,
    stepType: 'removeLiquidity',
    isComplete,
  })

  return {
    removeLiquidityStep,
  }
}
