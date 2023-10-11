'use client'

import { Box, Button, VStack } from '@chakra-ui/react'
import { TransactionState } from './TransactionState'
import {} from '@/lib/contracts/contract.types'
import { TransactionStep } from './TransactionStep'

interface Props {
  transactionStep: TransactionStep
}

export function TransactionStepButton({ transactionStep }: Props) {
  const { simulation, execution, result } = transactionStep.transactionInfo

  function handleOnClick() {
    if (!simulation.isError) {
      execution.write?.()
    }
  }

  return (
    <VStack>
      {execution.data?.hash && <TransactionState result={result}></TransactionState>}
      <Box margin={2} padding={2}>
        {!execution.isSuccess && (
          <Button
            isDisabled={!execution.write}
            isLoading={execution.isLoading}
            onClick={handleOnClick}
          >
            {transactionStep.getLabels().label}
          </Button>
        )}
        {execution.isSuccess && <Button onClick={execution.reset}>Try again</Button>}
      </Box>
    </VStack>
  )
}
