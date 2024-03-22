import { Box, VStack } from '@chakra-ui/react'
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { Step } from './Step'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'

type StepsProps = {
  currentIndex: number
  steps: { title: string }[]
}

export function Steps({ currentIndex, steps }: StepsProps) {
  const { flowStep } = useCurrentFlowStep()
  const colorMode = useThemeColorMode()

  const isLastStep = (index: number) => index === steps.length - 1

  return (
    <VStack align="start" spacing="xs">
      {steps.map((step, index) => (
        <>
          <Step
            key={step.title}
            currentIndex={currentIndex}
            index={index}
            step={step}
            colorMode={colorMode}
            flowStep={flowStep}
            isLastStep={isLastStep(index)}
          />
          {!isLastStep(index) && <Box h="4" w="1" rounded="full" background="border.base" ml="3" />}
        </>
      ))}
    </VStack>
  )
}
