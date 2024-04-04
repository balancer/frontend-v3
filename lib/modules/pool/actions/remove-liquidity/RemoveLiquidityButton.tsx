import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useConstructRemoveLiquidityStep } from './modal/useConstructRemoveLiquidityStep'

export function RemoveLiquidityButton() {
  const { removeLiquidityStep } = useConstructRemoveLiquidityStep()

  return <TransactionStepButton step={removeLiquidityStep} />
}
