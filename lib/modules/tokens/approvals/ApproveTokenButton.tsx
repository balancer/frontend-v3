/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { useAddLiquidity } from '../../pool/actions/add-liquidity/useAddLiquidity'
import { ApproveTokenProps, useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { CommonStepProps } from '../../pool/actions/useIterateSteps'

type Props = ApproveTokenProps & CommonStepProps

export function ApproveTokenButton({
  useOnStepCompleted,
  tokenAddress,
  amountToApprove,
  chain,
}: Props) {
  const { tokenAllowances } = useAddLiquidity()

  const tokenApprovalStep = useConstructApproveTokenStep({
    actionType: 'AddLiquidity',
    chain,
    spenderAddress: tokenAllowances.spenderAddress,
    tokenAddress: tokenAddress,
    amountToApprove: amountToApprove,
    tokenAllowances,
  })

  useOnStepCompleted(tokenApprovalStep)

  return <TransactionStepButton step={tokenApprovalStep}></TransactionStepButton>
}
