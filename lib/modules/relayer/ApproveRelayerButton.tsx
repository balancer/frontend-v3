import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'
import { CommonStepProps } from '../pool/actions/useIterateSteps'

export function ApproveRelayerButton({ useOnStepCompleted }: CommonStepProps) {
  const step = useConstructApproveRelayerStep()

  useOnStepCompleted(step)

  return <TransactionStepButton step={step}></TransactionStepButton>
}
