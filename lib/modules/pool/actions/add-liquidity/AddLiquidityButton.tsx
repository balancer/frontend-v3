/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useConstructAddLiquidityStep } from './useAddLiquidityStep'

export function AddLiquidityButton() {
  const { addLiquidityStep } = useConstructAddLiquidityStep()

  return <TransactionStepButton step={addLiquidityStep} />
}
