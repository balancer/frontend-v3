'use client'

import { Box, Button, VStack } from '@chakra-ui/react'
import { TransactionState } from '@/app/debug/TransactionState'
import { TransactionStep } from './lib'

interface Props {
  step: TransactionStep
}

export function TransactionStepButton({ step: { simulation, execution, result, getLabels } }: Props) {

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
            {getLabels().label}
          </Button>
        )}
        {execution.isSuccess && <Button onClick={execution.reset}>Try again</Button>}
      </Box>
    </VStack>
  )
}
