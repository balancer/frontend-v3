import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { AddLiquidityBuildQueryResponse } from './queries/useAddLiquidityBuildCallDataQuery'

export function useConstructAddLiquidityStep(buildCallDataQuery: AddLiquidityBuildQueryResponse) {
  const transactionLabels: TransactionLabels = {
    init: 'Add liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity added to pool!`,
    tooltip: 'Add liquidity to pool.',
  }

  const addLiquidityTransaction = useManagedSendTransaction(
    transactionLabels,
    buildCallDataQuery.data
  )

  const isComplete = () => addLiquidityTransaction.result.isSuccess

  const addLiquidityStep: FlowStep = {
    ...addLiquidityTransaction,
    transactionLabels,
    id: `addLiquidityPool`,
    stepType: 'addLiquidity',
    isComplete,
  }

  return {
    addLiquidityStep,
    addLiquidityTransaction,
  }
}
