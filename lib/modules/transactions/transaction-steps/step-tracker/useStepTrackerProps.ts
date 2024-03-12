import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { useColorMode } from '@chakra-ui/react'
import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { SupportedChainId } from '@/lib/config/config.types'
import { StepConfig } from '../useIterateSteps'

type StepTrackerProps = {
  stepConfigs: StepConfig[]
  currentStepIndex: number
  chainId: SupportedChainId
}

/*
  Prepares steps and indexes handling edge-cases like the Sign Relayer step.
  Generates the props used by the two UI versions of the StepTracker component (Mobile and Desktop).
*/
export function useStepTrackerProps({ stepConfigs, currentStepIndex, chainId }: StepTrackerProps) {
  const { flowStep } = useCurrentFlowStep()
  const { colorMode } = useColorMode()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const hasSignRelayerStep = relayerMode === 'signRelayer'

  function getCurrentIndex() {
    if (hasSignRelayerStep) {
      if (shouldSignRelayerApproval) return 0
      return currentStepIndex + 1
    }
    return currentStepIndex
  }

  const steps = hasSignRelayerStep ? [{ title: 'Sign relayer' }, ...stepConfigs] : stepConfigs
  const currentStep = steps[getCurrentIndex()]
  const currentStepPosition = `Step ${getCurrentIndex() + 1}/${steps.length}`

  return {
    steps,
    currentIndex: getCurrentIndex(),
    step: currentStep,
    colorMode,
    flowStep,
    currentStepPosition,
  }
}
