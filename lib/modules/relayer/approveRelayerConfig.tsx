import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import {
  CommonStepProps,
  OnStepCompleted,
  StepConfig,
} from '../transactions/transaction-steps/useIterateSteps'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'
import { SupportedChainId } from '@/lib/config/config.types'

export const getApproveRelayerConfig = (chainId: SupportedChainId): StepConfig => ({
  title: 'Approve relayer',
  render(useOnStepCompleted: OnStepCompleted) {
    return <ApproveRelayerButton useOnStepCompleted={useOnStepCompleted} chainId={chainId} />
  },
})

function ApproveRelayerButton({
  useOnStepCompleted,
  chainId,
}: CommonStepProps & { chainId: SupportedChainId }) {
  const step = useConstructApproveRelayerStep(chainId)

  useOnStepCompleted(step)

  return <TransactionStepButton step={step} />
}
