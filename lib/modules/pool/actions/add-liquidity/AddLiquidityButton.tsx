/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'

export function AddLiquidityButton() {
  const { addLiquidityStep } = useConstructAddLiquidityStep()

  const isComplete = addLiquidityStep.isComplete()

  if (isComplete) return
  return <TransactionStepButton step={addLiquidityStep} />
}
