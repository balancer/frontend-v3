'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import { Button, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useConstructSwapStep } from './useConstructSwapStep'
import { useTokenBalances } from '../tokens/useTokenBalances'

type Props = {
  closeModal: () => void
}

export function SwapButton({ closeModal }: Props) {
  const { swapStep } = useConstructSwapStep()
  const { refetchBalances } = useTokenBalances()

  const isComplete = swapStep.isComplete()

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
