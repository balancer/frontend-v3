import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useRemoveLiquidityStep } from './modal/useRemoveLiquidityStep'

export function RemoveLiquidityButton() {
  const { removeLiquidityStep } = useRemoveLiquidityStep()

  return <TransactionStepButton step={removeLiquidityStep} />
}
