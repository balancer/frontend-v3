import { OnTransactionStateUpdate } from '@/lib/shared/components/btns/transaction-steps/lib'
import { Button, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useSwap } from './useSwap'
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'

type Props = {
  onTransactionStateUpdate: OnTransactionStateUpdate
}

export function SwapButton({ onTransactionStateUpdate }: Props) {
  const { previewModalDisclosure } = useSwap()
  const { addLiquidityStep, addLiquidityTransaction } = useConstructAddLiquidityStep()

  const isComplete = addLiquidityStep.isComplete()

  // To be used by Timeout component to freeze queries
  const transactionState = getTransactionState(addLiquidityTransaction)
  useEffect(() => {
    onTransactionStateUpdate(transactionState)
  }, [transactionState])

  return (
    <VStack w="full">
      {!isComplete && <TransactionStepButton step={addLiquidityStep} />}

      {isComplete && (
        <Button w="full" size="lg" onClick={() => previewModalDisclosure.onClose()}>
          Done
        </Button>
      )}
    </VStack>
  )
}
