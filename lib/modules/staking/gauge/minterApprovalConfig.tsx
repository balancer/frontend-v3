import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { CommonStepProps, OnStepCompleted, StepConfig } from '../../pool/actions/useIterateSteps'
import { useConstructMinterApprovalStep } from './useConstructMinterApprovalStep'
import { VStack } from '@chakra-ui/react'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export function minterApprovalConfig(chain: GqlChain): StepConfig {
  return {
    render(useOnStepCompleted: OnStepCompleted) {
      return <MinterApprovalButton useOnStepCompleted={useOnStepCompleted} chain={chain} />
    },
  }
}

function MinterApprovalButton({ useOnStepCompleted, chain }: CommonStepProps) {
  const step = useConstructMinterApprovalStep(chain)

  useOnStepCompleted(step)

  return (
    <VStack w="full">
      <TransactionStepButton step={step} />
    </VStack>
  )
}
