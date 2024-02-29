'use client'

import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'

import { StepIndicator, Step } from './Step'
import { StepConfig } from '../useIterateSteps'

type StepTrackerProps = {
  stepConfigs: StepConfig[]
  currentStepIndex: number
}

export function StepTracker({ stepConfigs, currentStepIndex }: StepTrackerProps) {
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

  const steps = hasSignRelayerStep ? [{ title: 'Sign relayer' }, ...stepConfigs] : stepConfigs

  const currentStepTitle = steps[getCurrentIndex()].title

  const currentStepPosition = `Step ${getCurrentIndex() + 1}/${steps.length}`

  return (
    <Accordion width="full" variant="gradient" allowToggle textAlign="left">
      <AccordionItem m="0" p="0">
        <AccordionButton p="0" mb="4">
          <HStack width="full" justify="flex-start" fontSize="md">
            <StepIndicator stepNumber={getCurrentIndex() + 1} status="active" />
            <Text>{currentStepTitle}</Text>
          </HStack>
          <HStack justify="flex-end" fontSize="sm">
            <Text whiteSpace="nowrap">{currentStepPosition}</Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
        <AccordionPanel marginInlineStart="2" p="0">
          <Steps currentIndex={getCurrentIndex()} steps={steps}></Steps>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

type StepsProps = {
  currentIndex: number
  steps: { title: string }[]
}

function Steps({ currentIndex, steps }: StepsProps) {
  return (
    <VStack alignItems="left">
      {steps.map((step, index) => (
        <Step key={step.title} currentIndex={currentIndex} index={index} step={step} />
      ))}
    </VStack>
  )
}
