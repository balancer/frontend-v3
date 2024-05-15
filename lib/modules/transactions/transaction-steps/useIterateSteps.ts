/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { FlowStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export type OnStepCompleted = (step: FlowStep) => void

// This props are common to every step component
export type CommonStepProps = {
  useOnStepCompleted: OnStepCompleted
}

export interface MinterStepProps extends CommonStepProps {
  chain: GqlChain
}

export interface StepConfig {
  title: string // Used by the StepTracker to render step titles in the multi-step flow
  render(useOnStepCompleted?: OnStepCompleted): JSX.Element
}

export function useIterateSteps(steps: StepConfig[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const isFinalStepActive = currentStepIndex === steps.length - 1

  const goToNextStep = () => {
    if (isFinalStepActive) {
      return
    }
    setCurrentStepIndex(currentStepIndex + 1)
  }

  function getCurrentStep(): StepConfig {
    return steps[currentStepIndex]
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
    currentStepIndex,
  }
}