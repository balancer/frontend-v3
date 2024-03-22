import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { FlowStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { VStack } from '@chakra-ui/react'

interface ClaimButtonProps {
  step: FlowStep
}

export function ClaimButton({ step }: ClaimButtonProps) {
  const isComplete = step.isComplete()
  return <VStack w="full">{!isComplete && <TransactionStepButton step={step} />}</VStack>
}
