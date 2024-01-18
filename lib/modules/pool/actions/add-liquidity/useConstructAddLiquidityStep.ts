import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useAddLiquidity } from './useAddLiquidity'

export function useConstructAddLiquidityStep(poolId: string) {
  const { buildCallDataQuery, activateStep } = useAddLiquidity()

  const transactionLabels = buildAddLiquidityLabels(poolId)

  const transaction = useManagedSendTransaction(transactionLabels, buildCallDataQuery.data)

  const step: FlowStep = {
    ...transaction,
    transactionLabels,
    id: `addLiquidityPool${poolId}`,
    stepType: 'addLiquidity',
    isComplete: () => false,
    activateStep,
  }

  return {
    step,
    transaction,
    isLoading:
      transaction?.simulation.isLoading ||
      transaction?.execution.isLoading ||
      buildCallDataQuery.isLoading,
    error:
      transaction?.simulation.error || transaction?.execution.error || buildCallDataQuery.error,
  }
}

export const buildAddLiquidityLabels: BuildTransactionLabels = (poolId: Address) => {
  return {
    init: 'Add liquidity',
    confirming: 'Confirm add liquidity',
    confirmed: 'Back to pool',
    tooltip: 'TODO',
    description: `🎉 Liquidity added to pool ${poolId}`,
  }
}
