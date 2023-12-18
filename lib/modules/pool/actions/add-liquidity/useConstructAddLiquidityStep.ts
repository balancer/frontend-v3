import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Address } from 'wagmi'
import { useActiveStep } from '../../../../shared/hooks/transaction-flows/useActiveStep'
import { HumanAmountIn } from '../liquidity-types'
import { useAddLiquidity } from './useAddLiquidity'

export function useConstructAddLiquidityStep(humanAmountsIn: HumanAmountIn[], poolId: string) {
  const { isActiveStep, activateStep } = useActiveStep()

  const { setAmountIn, useBuildTx, lastSdkQueryOutput } = useAddLiquidity()

  const addLiquidityQuery = useBuildTx(humanAmountsIn, isActiveStep)

  const transactionLabels = buildAddLiquidityLabels(poolId)

  const transaction = useManagedSendTransaction(transactionLabels, addLiquidityQuery.data)

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
      addLiquidityQuery.isLoading,
    error: transaction?.simulation.error || transaction?.execution.error || addLiquidityQuery.error,
    // The following functions are only exposed for testing purposes so that we can
    // "simulate" the preview step to test useConstructREmoveLiquidityStep hook
    _setAmountIn: setAmountIn,
    _lastSdkQueryOutput: lastSdkQueryOutput,
  }
}

export const buildAddLiquidityLabels: BuildTransactionLabels = (poolId: Address) => {
  return {
    init: 'Add pool liquidity',
    confirming: 'Confirm add liquidity',
    tooltip: 'TODO',
    description: `🎉 Liquidity added to pool ${poolId}`,
  }
}
