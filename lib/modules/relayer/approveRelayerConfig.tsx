import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { CommonStepProps, OnStepCompleted, StepConfig } from '../pool/actions/useIterateSteps'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'

export const approveRelayerConfig: StepConfig = {
  title: 'Approve relayer',
  render(useOnStepCompleted: OnStepCompleted) {
    return <ApproveRelayerButton useOnStepCompleted={useOnStepCompleted} />
  },
}

function ApproveRelayerButton({ useOnStepCompleted }: CommonStepProps) {
  const step = useConstructApproveRelayerStep()

  useOnStepCompleted(step)

  return <TransactionStepButton step={step} />
}
