import { VStack } from '@chakra-ui/react'
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { Step } from './Step'
import { useThemeColor } from '@/lib/shared/services/chakra/useThemeColor'

type StepsProps = {
  currentIndex: number
  steps: { title: string }[]
}

export function Steps({ currentIndex, steps }: StepsProps) {
  const { flowStep } = useCurrentFlowStep()
  const themeColor = useThemeColor()

  return (
    <VStack alignItems="left">
      {steps.map((step, index) => (
        <Step
          key={step.title}
          currentIndex={currentIndex}
          index={index}
          step={step}
          colorMode={themeColor}
          flowStep={flowStep}
          isLastStep={index === steps.length - 1}
        />
      ))}
    </VStack>
  )
}
