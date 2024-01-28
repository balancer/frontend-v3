/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ApproveTokenProps } from '../../tokens/approvals/useConstructApproveTokenStep'
import {
  FlowStep,
  TransactionState,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'

// This props are common to every step component
export type CommonStepProps = {
  useOnStepCompleted: (step: FlowStep) => void
}

export interface AddLiquidityMetadata {
  type: 'addLiquidity'
  // no props
}

export interface ApproveTokenMetadata {
  type: 'approveToken'
  props: ApproveTokenProps
}

export type StepMetadata = AddLiquidityMetadata | ApproveTokenMetadata

export function useIterateSteps(steps: StepMetadata[]) {
  const [activeStepIndex, setActiveStep] = useState(0)

  const isFinalStepActive = activeStepIndex === steps.length - 1

  // Expose the transaction state of the last step to freeze the timeout refetch
  let finalStepTransactionState: TransactionState | undefined

  const goToNextStep = (completedStep: FlowStep) => {
    if (isFinalStepActive) {
      finalStepTransactionState = getTransactionState(completedStep)
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
      if (isComplete) goToNextStep(step)
    }, [isComplete])
  }

  const currentStep = getCurrentStep()

  return {
    useOnStepCompleted,
    currentStep,
    isFinalStepActive,
    finalStepTransactionState,
  }
}
