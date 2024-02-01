import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { StepConfig } from '../useIterateSteps'
import { AddLiquidityButton } from './AddLiquidityButton'

export function buildAddLiquidityConfig(
  setAddLiquidityTxState: (transactionState: TransactionState) => void
): StepConfig {
  function Render() {
    return (
      <AddLiquidityButton onTransactionStateUpdate={setAddLiquidityTxState}></AddLiquidityButton>
    )
  }
  return {
    Render,
  }
}
