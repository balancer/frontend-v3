import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { CommonStepProps, OnStepCompleted, StepConfig } from '../../pool/actions/useIterateSteps'
import { useConstructMinterApprovalStep } from './useConstructMinterApprovalStep'
import { VStack } from '@chakra-ui/react'

export const minterApprovalConfig: StepConfig = {
  render(useOnStepCompleted: OnStepCompleted) {
    return <MinterApprovalButton useOnStepCompleted={useOnStepCompleted} />
  },
}

function MinterApprovalButton({ useOnStepCompleted }: CommonStepProps) {
  const step = useConstructMinterApprovalStep()

  useOnStepCompleted(step)

  return (
    <VStack w="full">
      <TransactionStepButton step={step} />
    </VStack>
  )
}
