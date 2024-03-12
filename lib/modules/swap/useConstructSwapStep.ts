/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { useSwap } from './useSwap'
import { useBuildSwapQuery } from './queries/useBuildSwapQuery'
import { getChainId } from '@/lib/config/app.config'

export function useConstructSwapStep() {
  const transactionLabels: TransactionLabels = {
    init: 'Swap',
    confirming: 'Confirming...',
    confirmed: `Swapped!`,
    tooltip: 'Swap A for B',
  }

  const { simulationQuery, selectedChain } = useSwap()
  const buildSwapQuery = useBuildSwapQuery()

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
    if (simulationQuery.data) {
      buildSwapQuery.refetch()
    }
  }, [JSON.stringify(simulationQuery.data)])

  const chainId = buildSwapQuery.data?.chainId || getChainId(selectedChain)

  const swapTransaction = useManagedSendTransaction(transactionLabels, chainId, buildSwapQuery.data)

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
