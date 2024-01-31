import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'
import { CommonStepProps } from '../pool/actions/useIterateSteps'

type Props = CommonStepProps

export function ApproveRelayerButton({ useOnStepCompleted }: Props) {
  const step = useConstructApproveRelayerStep()

  useOnStepCompleted(step)

  return <TransactionStepButton step={step}></TransactionStepButton>
}
