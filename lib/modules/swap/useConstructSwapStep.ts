import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'

export function useConstructSwapStep() {
  const transactionLabels: TransactionLabels = {
    init: 'Swap',
    confirming: 'Confirming...',
    confirmed: `Swap confirmed!`,
    tooltip: 'Swap X for Y.',
  }

  const { simulationQuery } = useAddLiquidity()
  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery()

  // useEffect(() => {
  //   // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
  //   if (simulationQuery.data) {
  //     buildCallDataQuery.refetch()
  //   }
  // }, [simulationQuery.data])

  const addLiquidityTransaction = useManagedSendTransaction(
    transactionLabels,
    buildCallDataQuery.data
  )

  const isComplete = () => addLiquidityTransaction.result.isSuccess

  const swapStep: FlowStep = {
    ...addLiquidityTransaction,
    transactionLabels,
    id: `swap`,
    stepType: 'swap',
    isComplete,
  }

  return {
    swapStep,
    addLiquidityTransaction,
  }
}
