/* eslint-disable react-hooks/exhaustive-deps */
import {
  OnTransactionStateUpdate,
  getTransactionState,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { Button, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useConstructSwapStep } from './useConstructSwapStep'
import { useTokenBalances } from '../tokens/useTokenBalances'

type Props = {
  onTransactionStateUpdate: OnTransactionStateUpdate
  closeModal: () => void
}

export function SwapButton({ onTransactionStateUpdate, closeModal }: Props) {
  const { swapStep, swapTransaction } = useConstructSwapStep()
  const { refetchBalances } = useTokenBalances()

  const isComplete = swapStep.isComplete()

  // To be used by Timeout component to freeze queries
  const transactionState = getTransactionState(swapTransaction)
  useEffect(() => {
    onTransactionStateUpdate(transactionState)
  }, [transactionState])

  // Refetch balances after swap is complete
  useEffect(() => {
    if (isComplete) refetchBalances()
  }, [isComplete])

  return (
    <VStack w="full">
      {isComplete ? (
        <Button w="full" size="lg" onClick={closeModal}>
          Close
        </Button>
      ) : (
        <TransactionStepButton step={swapStep} />
      )}
    </VStack>
  )
}
