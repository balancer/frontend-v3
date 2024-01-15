import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useAddLiquidity } from './useAddLiquidity'

export function useConstructAddLiquidityStep(poolId: string) {
  const { transactionConfig, isMixedQueryLoading, mixedQueryError, setBuildCallReady } =
    useAddLiquidity()

  const activateStep = () => {
    return setBuildCallReady(true)
  }

  const transactionLabels = buildAddLiquidityLabels(poolId)

  const transaction = useManagedSendTransaction(transactionLabels, transactionConfig)

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
    isLoading:
      transaction?.simulation.isLoading || transaction?.execution.isLoading || isMixedQueryLoading,
    error: transaction?.simulation.error || transaction?.execution.error || mixedQueryError,
  }
}

export const buildAddLiquidityLabels: BuildTransactionLabels = (poolId: Address) => {
  return {
    init: 'Add liquidity',
    confirming: 'Confirm add liquidity',
    tooltip: 'TODO',
    description: `🎉 Liquidity added to pool ${poolId}`,
  }
}
