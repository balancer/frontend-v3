'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepStatus,
  StepTitle,
  Stepper,
} from '@chakra-ui/react'
import { useAddLiquidity } from './useAddLiquidity'

export function StepTracker() {
  const { stepConfigs, currentStepIndex } = useAddLiquidity()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval()
  const hasSignRelayerStep = relayerMode === 'signRelayer'

  function getCurrentIndex() {
    if (hasSignRelayerStep) {
      if (shouldSignRelayerApproval) return 0
      return currentStepIndex + 1
    }
    return currentStepIndex
  }

  function isCurrent(index: number) {
    return getCurrentIndex() === index
  }

  const steps = hasSignRelayerStep ? [{ description: 'Sign relayer' }, ...stepConfigs] : stepConfigs

  return <Steps currentIndex={getCurrentIndex()} steps={steps} isCurrent={isCurrent}></Steps>
}

type Props = {
  currentIndex: number
  isCurrent: (i: number) => boolean
  steps: { description: string }[]
}

function Steps({ currentIndex, steps, isCurrent }: Props) {
  return (
    <Stepper index={currentIndex} orientation="vertical" colorScheme="blue">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <StepTitle>{step.description}</StepTitle>
          {isCurrent(index) && <StepDescription>***</StepDescription>}
        </Step>
      ))}
    </Stepper>
  )
}
