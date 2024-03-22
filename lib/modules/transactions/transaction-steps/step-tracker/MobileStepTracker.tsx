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
import { GasPriceCard } from '@/lib/shared/hooks/useGasPrice'

export function MobileStepTracker(props: StepTrackerProps) {
  const currentStepProps = useStepTrackerProps(props)
  if (!currentStepProps.step) return null
  const currentStepTitle = currentStepProps.step.title
  const { currentStepPosition, currentIndex, steps, chain } = currentStepProps

  return (
    <Accordion width="full" variant="button" allowToggle textAlign="left">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <HStack width="full" justify="flex-start" fontSize="md">
                <StepIndicator {...currentStepProps} index={currentIndex} />
                <Text>{currentStepTitle}</Text>
              </HStack>
              <HStack justify="flex-end" fontSize="sm">
                {isExpanded && <GasPriceCard chain={chain} />}
                <Text whiteSpace="nowrap" color={isExpanded ? 'font.link' : 'font.highlight'}>
                  {currentStepPosition}
                </Text>
                <AccordionIcon textColor={isExpanded ? 'font.link' : 'font.highlight'} />
              </HStack>
            </AccordionButton>
            <AccordionPanel pt="md">
              <Steps currentIndex={currentIndex} steps={steps}></Steps>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  )
}
