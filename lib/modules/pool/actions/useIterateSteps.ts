import { useEffect, useState } from 'react'
import { ApproveTokenProps } from '../../tokens/approvals/useConstructApproveTokenStep'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'

type AddLiquidityMetadata = {
  type: 'addLiquidity'
  props: undefined
}

export const stepAddLiquidity: AddLiquidityMetadata = {
  type: 'addLiquidity',
  props: undefined,
}

// const stepAddLiquidity: StepMetadata Step = {
//   type: 'addLiquidity',
//   props: undefined,
// }

export interface ApproveTokenMetadata {
  type: 'approveToken'
  props: ApproveTokenProps
}

export type StepMetadata = AddLiquidityMetadata | ApproveTokenMetadata

export function useIterateSteps(steps: StepMetadata[]) {
  const [activeStepIndex, setActiveStep] = useState(0)
  const goToNextStep = () => setActiveStep(activeStepIndex + 1)

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
  // currentStep.props = {
  //   ...currentStep.props,
  //   useOnStepCompleted,
  // }

  return { useOnStepCompleted, currentStep }
}
