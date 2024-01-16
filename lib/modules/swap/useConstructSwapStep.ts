import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { useAddLiquidity } from './useAddLiquidity'

export function useConstructSwapStep(poolId: string) {
  const { isActiveStep, activateStep } = useActiveStep()

  const { useBuildCallData } = useAddLiquidity()

  const buildCallDataQuery = useBuildCallData(isActiveStep)

  const transactionLabels = {
    init: 'Swap',
    confirming: 'Confirm swap',
    tooltip: 'TODO',
    description: `🎉 Swap executed`,
  }

  const transaction = useManagedSendTransaction(transactionLabels, buildCallDataQuery.data)

  const step: FlowStep = {
    ...transaction,
    transactionLabels,
    id: `addLiquidityPool${poolId}`, // What is this id for? It's not very unique...
    stepType: 'swap',
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
