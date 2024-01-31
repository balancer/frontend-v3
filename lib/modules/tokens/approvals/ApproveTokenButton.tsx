/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { ApproveTokenProps, useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { CommonStepProps } from '../../pool/actions/useIterateSteps'

type Props = ApproveTokenProps & CommonStepProps

export function ApproveTokenButton({
  useOnStepCompleted,
  tokenAmountToApprove,
  tokenAllowances,
}: Props) {
  const tokenApprovalStep = useConstructApproveTokenStep({
    actionType: 'AddLiquidity',
    spenderAddress: tokenAllowances.spenderAddress,
    tokenAllowances,
    tokenAmountToApprove,
  })

  useOnStepCompleted(tokenApprovalStep)

  return <TransactionStepButton step={tokenApprovalStep}></TransactionStepButton>
}
