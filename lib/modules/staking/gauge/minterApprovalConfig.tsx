import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import {
  MinterStepProps,
  OnStepCompleted,
  StepConfig,
} from '../../transactions/transaction-steps/useIterateSteps'
import { useConstructMinterApprovalStep } from './useConstructMinterApprovalStep'
import { VStack } from '@chakra-ui/react'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export function minterApprovalConfig(chain: GqlChain): StepConfig {
  return {
    title: 'Approve relayer as minter',
    render(useOnStepCompleted: OnStepCompleted) {
      return <MinterApprovalButton useOnStepCompleted={useOnStepCompleted} chain={chain} />
    },
  }
}

function MinterApprovalButton({ useOnStepCompleted, chain }: MinterStepProps) {
  const step = useConstructMinterApprovalStep(chain)

  useOnStepCompleted(step)

  return (
    <VStack w="full">
      <TransactionStepButton step={step} />
    </VStack>
  )
}
