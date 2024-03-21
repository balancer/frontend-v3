import { VStack } from '@chakra-ui/react'
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

  return (
    <VStack align="start">
      {steps.map((step, index) => (
        <Step
          key={step.title}
          currentIndex={currentIndex}
          index={index}
          step={step}
          colorMode={colorMode}
          flowStep={flowStep}
          isLastStep={index === steps.length - 1}
        />
      ))}
    </VStack>
  )
}
