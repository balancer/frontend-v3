/* eslint-disable react-hooks/exhaustive-deps */
import {
  OnTransactionStateUpdate,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { Button, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { useConstructSwapStep } from './useConstructSwapStep'

type Props = {
  onTransactionStateUpdate: OnTransactionStateUpdate
}

export function SwapButton({ onTransactionStateUpdate }: Props) {
  const { swapStep, swapTransaction } = useConstructSwapStep()

  const isComplete = swapStep.isComplete()

  // To be used by Timeout component to freeze queries
  const transactionState = getTransactionState(swapTransaction)
  useEffect(() => {
    onTransactionStateUpdate(transactionState)
  }, [transactionState])

  return (
    <VStack w="full">
      {isComplete ? (
        <Button w="full" size="lg">
          Close
        </Button>
      ) : (
        <TransactionStepButton step={swapStep} />
      )}
    </VStack>
  )
}
