import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { RemoveLiquidityBuildQueryResponse } from '../queries/useRemoveLiquidityBuildCallDataQuery'

export function useConstructRemoveLiquidityStep(
  poolId: string,
  buildCallDataQuery: RemoveLiquidityBuildQueryResponse,
  activateStep: () => void
) {
  const transactionLabels: TransactionLabels = {
    init: 'Remove liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity removed from pool!`,
    tooltip: 'Remove liquidity from pool.',
  }

  const removeLiquidityTransaction = useManagedSendTransaction(
    transactionLabels,
    buildCallDataQuery.data
  )

  const isComplete = () => removeLiquidityTransaction.result.isSuccess

  const removeLiquidityStep: FlowStep = {
    ...removeLiquidityTransaction,
    transactionLabels,
    id: `removeLiquidityPool${poolId}`,
    stepType: 'removeLiquidity',
    isComplete,
    activateStep,
  }

  return {
    removeLiquidityStep,
    removeLiquidityTransaction,
    isLoading:
      removeLiquidityTransaction?.simulation.isLoading ||
      removeLiquidityTransaction?.execution.isLoading ||
      buildCallDataQuery.isLoading,
    error:
      removeLiquidityTransaction?.simulation.error ||
      removeLiquidityTransaction?.execution.error ||
      buildCallDataQuery.error,
  }
}
