import { OnTransactionStateUpdate } from '@/lib/shared/components/btns/transaction-steps/lib'
import { StepConfig } from '../../useIterateSteps'
import { RemoveLiquidityButton } from '../RemoveLiquidityButton'

export function useRemoveLiquidityConfig(
  onTransactionStateUpdate: OnTransactionStateUpdate
): StepConfig {
  function render() {
    return (
      <RemoveLiquidityButton
        onTransactionStateUpdate={onTransactionStateUpdate}
      ></RemoveLiquidityButton>
    )
  }
  return { render }
}
