import { Box, VStack } from '@chakra-ui/react'
import { Step } from './Step'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { useTransactionSteps } from '../TransactionStepsProvider'

export function Steps() {
  const { transactionSteps, currentStepIndex, isLastStep } = useTransactionSteps()
  const colorMode = useThemeColorMode()

  return (
    <VStack align="start" spacing="xs">
      {transactionSteps.map((step, index) => (
        <div key={step.labels.title}>
          <Step
            currentIndex={currentStepIndex}
            index={index}
            step={step}
            colorMode={colorMode}
            isLastStep={isLastStep(index)}
          />
          {!isLastStep(index) && (
            <Box h="4" w="1" rounded="full" background="border.base" ml="3" mt="1" />
          )}
        </div>
      ))}
    </VStack>
  )
}
