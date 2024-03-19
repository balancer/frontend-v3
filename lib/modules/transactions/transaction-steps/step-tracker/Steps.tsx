import { VStack, useColorMode } from '@chakra-ui/react'
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { Step } from './Step'

type StepsProps = {
  currentIndex: number
  steps: { title: string }[]
}

export function Steps({ currentIndex, steps }: StepsProps) {
  const { flowStep } = useCurrentFlowStep()
  const { colorMode } = useColorMode()

  return (
    <VStack alignItems="left" p="sm" pt="0">
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
