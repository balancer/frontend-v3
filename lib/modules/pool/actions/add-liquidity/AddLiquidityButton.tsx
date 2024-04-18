/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { useRouter } from 'next/navigation'

export function AddLiquidityButton() {
  const { addLiquidityStep } = useConstructAddLiquidityStep()
  // const router = useRouter()

  // if (addLiquidityStep.isComplete()) {
  //   return router.push(`./add-liquidity/${addLiquidityStep?.result.data?.transactionHash}`)
  // }

  return <TransactionStepButton step={addLiquidityStep} />
}
