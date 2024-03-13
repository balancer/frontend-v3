/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react'

import { useCurrentFlowStep } from '../useCurrentFlowStep'
import { StepConfig } from '../useIterateSteps'
import { Step, StepIndicator } from './Step'
import { StepProps } from './getStepSettings'
import { SupportedChainId } from '@/lib/config/config.types'
import { useEffect, useState } from 'react'

type StepTrackerProps = {
  stepConfigs: StepConfig[]
  currentStepIndex: number
  chainId: SupportedChainId
}

export function StepTracker({ stepConfigs, currentStepIndex }: StepTrackerProps) {
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
  const currentStepTitle = currentStep?.title

  const currentStepPosition = `Step ${getCurrentIndex() + 1}/${steps.length}`

  const currentStepProps: StepProps = {
    currentIndex: getCurrentIndex(),
    index: getCurrentIndex(),
    step: currentStep,
    colorMode,
    flowStep,
  }

  // Save initial step configs
  // As the user goes through the flow and completes the steps, some steps (like token approvals) disappear from the provided stepConfigs prop
  // so we save the initial list to display the whole progress in the step tracker.
  useEffect(() => {
    setInitialStepConfigs(stepConfigs)
  }, [])

  if (initialStepConfigs.length === 0) return null

  return (
    <Accordion width="full" variant="gradient" allowToggle textAlign="left">
      <AccordionItem m="0" p="0">
        <AccordionButton p="0" mb="4">
          <HStack width="full" justify="flex-start" fontSize="md">
            <StepIndicator {...currentStepProps} />
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
  const { flowStep } = useCurrentFlowStep()
  const { colorMode } = useColorMode()

  return (
    <VStack alignItems="left">
      {steps.map((step, index) => (
        <Step
          key={step.title}
          currentIndex={currentIndex}
          index={index}
          step={step}
          colorMode={colorMode}
          flowStep={flowStep}
        />
      ))}
    </VStack>
  )
}
