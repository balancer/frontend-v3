import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { useAddLiquidity } from './useAddLiquidity'

export function useConstructAddLiquidityStep(poolId: string) {
  const { isActiveStep, activateStep } = useActiveStep()

  const { useBuildCallData } = useAddLiquidity()

  const buildCallDataQuery = useBuildCallData(isActiveStep)

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
    tooltip: 'TODO',
    description: `🎉 Liquidity added to pool ${poolId}`,
  }
}
