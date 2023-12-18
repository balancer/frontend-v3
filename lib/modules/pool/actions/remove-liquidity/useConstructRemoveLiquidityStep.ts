import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { HumanAmountIn } from '../liquidity-types'
import { useRemoveLiquidity } from './useRemoveLiquidity'

export function useConstructRemoveLiquidityStep(humanAmountsIn: HumanAmountIn[], poolId: string) {
  const { isActiveStep, activateStep } = useActiveStep()

  const { setAmountIn, useBuildTx, lastSdkQueryOutput } = useRemoveLiquidity()

  const removeLiquidityQuery = useBuildTx(humanAmountsIn, isActiveStep)

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
    // The following functions are only exposed for testing purposes so that we can
    // "simulate" the preview step to test useConstructREmoveLiquidityStep hook
    _setAmountIn: setAmountIn,
    _lastSdkQueryOutput: lastSdkQueryOutput,
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
