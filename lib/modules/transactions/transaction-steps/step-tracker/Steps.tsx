import { Box, VStack } from '@chakra-ui/react'
import { Step } from './Step'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { useAddLiquidity } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'

export function Steps() {
  // TODO: generalize for all flows
  const { transactionSteps, currentStepIndex, isLastStep } = useAddLiquidity()
  const colorMode = useThemeColorMode()

  return (
    <VStack align="start" spacing="xs">
      {transactionSteps &&
        transactionSteps.map((step, index) => (
          <div key={step.id}>
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
