import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { OnStepCompleted, StepConfig } from '../pool/actions/useIterateSteps'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'

export const approveRelayerConfig: StepConfig = {
  Render(useOnStepCompleted: OnStepCompleted) {
    const step = useConstructApproveRelayerStep()
    useOnStepCompleted(step)

    return <TransactionStepButton step={step}></TransactionStepButton>
  },
}
