'use client'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Text,
} from '@chakra-ui/react'

import { StepIndicator } from './Step'
import { Steps } from './Steps'
import { StepTrackerProps } from './step-tracker.types'
import { useStepTrackerProps } from './useStepTrackerProps'

export function MobileStepTracker(props: StepTrackerProps) {
  const currentStepProps = useStepTrackerProps(props)
  const currentStepTitle = currentStepProps.step.title
  const { currentStepPosition, currentIndex, steps } = currentStepProps

  return (
    <Accordion width="full" variant="gradient" allowToggle textAlign="left">
      <AccordionItem m="0" p="0">
        <AccordionButton p="0" mb="4">
          <HStack width="full" justify="flex-start" fontSize="md">
            <StepIndicator {...currentStepProps} index={currentIndex} />
            <Text>{currentStepTitle}</Text>
          </HStack>
          <HStack justify="flex-end" fontSize="sm">
            <Text whiteSpace="nowrap">{currentStepPosition}</Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
        <AccordionPanel marginInlineStart="2" p="0">
          <Steps currentIndex={currentIndex} steps={steps}></Steps>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
