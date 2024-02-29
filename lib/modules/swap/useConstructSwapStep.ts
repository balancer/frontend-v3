/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect } from 'react'
import { useSwap } from './useSwap'
import { useBuildSwapQuery } from './queries/useBuildSwapQuery'

export function useConstructSwapStep() {
  const transactionLabels: TransactionLabels = {
    init: 'Swap',
    confirming: 'Confirming...',
    confirmed: `Swapped!`,
    tooltip: 'Swap A for B',
  }

  const { simulationQuery } = useSwap()
  const buildSwapQuery = useBuildSwapQuery()

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
    if (simulationQuery.data) {
      buildSwapQuery.refetch()
    }
  }, [JSON.stringify(simulationQuery.data)])

  const swapTransaction = useManagedSendTransaction(transactionLabels, buildSwapQuery.data)

  const isComplete = () => swapTransaction.result.isSuccess

  const swapStep: FlowStep = {
    ...swapTransaction,
    transactionLabels,
    id: `swap`,
    stepType: 'swap',
    isComplete,
  }

  return {
    swapStep,
    swapTransaction,
  }
}
