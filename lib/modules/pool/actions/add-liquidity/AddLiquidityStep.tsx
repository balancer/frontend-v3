/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { CommonStepProps } from '../useIterateSteps'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { AddLiquidityBuildQueryResponse } from './queries/useAddLiquidityBuildCallDataQuery'

type Props = CommonStepProps & AddLiquidityProps

export type AddLiquidityProps = {
  buildCallDataQuery: AddLiquidityBuildQueryResponse
}

export function AddLiquidityStep({ useOnStepCompleted, buildCallDataQuery }: Props) {
  const { addLiquidityStep } = useConstructAddLiquidityStep(buildCallDataQuery)

  useOnStepCompleted(addLiquidityStep)

  return <TransactionStepButton step={addLiquidityStep}></TransactionStepButton>
}
