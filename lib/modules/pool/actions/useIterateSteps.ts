/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'

export type OnStepCompleted = (step: FlowStep) => void

// This props are common to every step component
export type CommonStepProps = {
  useOnStepCompleted: OnStepCompleted
}

export interface StepConfig {
  render(useOnStepCompleted?: OnStepCompleted): any
}

export function useIterateSteps<T>(steps: StepConfig[]) {
  const [activeStepIndex, setActiveStep] = useState(0)

  const isFinalStepActive = activeStepIndex === steps.length - 1

  const goToNextStep = () => {
    if (isFinalStepActive) {
      return
    }
    setActiveStep(activeStepIndex + 1)
  }

  function getCurrentStep(): StepConfig {
    return steps[activeStepIndex]
  }

  // Goes to the next step in the sequence (goToNextStep) when the current step is completed
  function useOnStepCompleted(step: FlowStep) {
    const isComplete = step.isComplete()
    return useEffect(() => {
      if (isComplete) goToNextStep()
    }, [isComplete])
  }

  const currentStep = getCurrentStep()

  return {
    useOnStepCompleted,
    currentStep,
    isFinalStepActive,
  }
}
