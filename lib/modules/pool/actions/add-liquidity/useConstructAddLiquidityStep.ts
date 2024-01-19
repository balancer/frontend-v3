import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { AddLiquidityBuildQueryResponse } from './queries/useAddLiquidityBuildCallDataQuery'

export function useConstructAddLiquidityStep(
  poolId: string,
  buildCallDataQuery: AddLiquidityBuildQueryResponse,
  activateStep: () => void
) {
  const transactionLabels: TransactionLabels = {
    init: 'Add liquidity',
    confirming: 'Confirm add liquidity',
    confirmed: `🎉 Liquidity added to pool`,
    tooltip: 'TODO',
  }

  const addLiquidityTransaction = useManagedSendTransaction(
    transactionLabels,
    buildCallDataQuery.data
  )

  const isComplete = () => addLiquidityTransaction.result.isSuccess

  const addLiquidityStep: FlowStep = {
    ...addLiquidityTransaction,
    transactionLabels,
    id: `addLiquidityPool${poolId}`,
    stepType: 'addLiquidity',
    isComplete,
    activateStep,
  }

  return {
    addLiquidityStep,
    addLiquidityTransaction,
    isLoading:
      addLiquidityTransaction?.simulation.isLoading ||
      addLiquidityTransaction?.execution.isLoading ||
      buildCallDataQuery.isLoading,
    error:
      addLiquidityTransaction?.simulation.error ||
      addLiquidityTransaction?.execution.error ||
      buildCallDataQuery.error,
  }
}
