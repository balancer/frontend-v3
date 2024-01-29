/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ApproveTokenProps } from '../../tokens/approvals/useConstructApproveTokenStep'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'

// This props are common to every step component
export type CommonStepProps = {
  useOnStepCompleted: (step: FlowStep) => void
}

export interface AddLiquidityConfig {
  type: 'addLiquidity'
  // no props
}

export interface ApproveTokenConfig {
  type: 'approveToken'
  props: ApproveTokenProps
}

export type StepConfig = AddLiquidityConfig | ApproveTokenConfig

export function useIterateSteps(steps: StepConfig[]) {
  const [activeStepIndex, setActiveStep] = useState(0)

  const isFinalStepActive = activeStepIndex === steps.length - 1

  const goToNextStep = () => {
    if (isFinalStepActive) {
      return
    }
    setActiveStep(activeStepIndex + 1)
  }

  function getCurrentStep() {
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
