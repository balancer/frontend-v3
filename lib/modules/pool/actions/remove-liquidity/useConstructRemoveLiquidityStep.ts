import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { useBuildRemoveLiquidityQuery } from './queries/useBuildRemoveLiquidityTxQuery'
import { HumanAmountIn } from '../liquidity-types'

export function useConstructRemoveLiquidityStep(humanAmountsIn: HumanAmountIn[], poolId: string) {
  const { isActiveStep, activateStep } = useActiveStep()

  const removeLiquidityQuery = useBuildRemoveLiquidityQuery(humanAmountsIn, isActiveStep, poolId)

  const transactionLabels = buildAddLiquidityLabels(poolId)

  const transaction = useManagedSendTransaction(transactionLabels, removeLiquidityQuery.data)

  const step: FlowStep = {
    ...transaction,
    transactionLabels,
    id: `removeLiquidityPool${poolId}`,
    stepType: 'removeLiquidity',
    isComplete: () => false,
    activateStep,
  }

  return {
    step,
    isLoading:
      transaction?.simulation.isLoading ||
      transaction?.execution.isLoading ||
      removeLiquidityQuery.isLoading,
    error:
      transaction?.simulation.error || transaction?.execution.error || removeLiquidityQuery.error,
  }
}

export const buildAddLiquidityLabels: BuildTransactionLabels = (poolId: Address) => {
  return {
    init: 'Remove liquidity',
    confirming: 'Confirm remove liquidity',
    tooltip: 'TODO',
    description: `🎉 Liquidity removed from pool ${poolId}`,
  }
}
