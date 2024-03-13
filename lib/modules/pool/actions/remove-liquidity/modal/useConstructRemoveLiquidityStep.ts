/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useRemoveLiquidityBuildCallDataQuery } from '../queries/useRemoveLiquidityBuildCallDataQuery'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { useEffect } from 'react'
import { usePool } from '../../../usePool'
import { useSyncCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'

export function useConstructRemoveLiquidityStep() {
  const { chainId } = usePool()

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
    chainId,
    buildCallDataQuery.data
  )

  const isComplete = () => removeLiquidityTransaction.result.isSuccess

  const removeLiquidityStep = useSyncCurrentFlowStep({
    ...removeLiquidityTransaction,
    transactionLabels,
    id: `removeLiquidityPool`,
    stepType: 'removeLiquidity',
    isComplete,
  })

  return {
    removeLiquidityStep,
    removeLiquidityTransaction,
  }
}
