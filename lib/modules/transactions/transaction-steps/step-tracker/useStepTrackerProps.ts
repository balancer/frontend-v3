/* eslint-disable react-hooks/exhaustive-deps */
import { SupportedChainId } from '@/lib/config/config.types'
import { useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { StepConfig } from '../useIterateSteps'

type StepTrackerProps = {
  stepConfigs: StepConfig[]
  currentStepIndex: number
}

/*
  Prepares steps and indexes to be used by the two UI versions of the StepTracker component (Mobile and Desktop).
*/
export function useStepTrackerProps({ stepConfigs, currentStepIndex }: StepTrackerProps) {
  const [initialStepConfigs, setInitialStepConfigs] = useState<StepConfig[]>([])

  const { flowStep } = useCurrentFlowStep()
  const { colorMode } = useColorMode()

  // Number of steps that were completed and deleted from the original stepConfigs list
  const deletedStepsCount =
    initialStepConfigs.length === 0 ? 0 : initialStepConfigs.length - stepConfigs.length

  function getCurrentIndex() {
    return currentStepIndex + deletedStepsCount
  }

  const steps = initialStepConfigs
  const currentStep = steps[getCurrentIndex()]
  const isLastStep = getCurrentIndex() >= stepConfigs.length - 1

  const currentStepPosition = `Step ${getCurrentIndex() + 1}/${steps.length}`

  // Save initial step configs
  // As the user goes through the flow and completes the steps, some steps (like token approvals) disappear from the provided stepConfigs prop
  // so we save the initial list to display the whole progress in the step tracker.
  useEffect(() => {
    setInitialStepConfigs(stepConfigs)
  }, [])

  return {
    step: currentStep,
    isLastStep,
    currentIndex: getCurrentIndex(),
    colorMode,
    flowStep,
    currentStepPosition,
    steps: initialStepConfigs,
  }
}
