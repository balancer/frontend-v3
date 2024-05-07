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
import { GasPriceCard } from '@/lib/shared/hooks/useGasPrice'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useTransactionSteps } from '../TransactionStepsProvider'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'

export function MobileStepTracker({ chain }: { chain: GqlChain }) {
  const { currentStep, currentStepIndex, transactionSteps } = useTransactionSteps()
  const colorMode = useThemeColorMode()

  const stepLabel = `Step ${currentStepIndex + 1}/${transactionSteps.length}`

  return (
    <Accordion width="full" variant="button" allowToggle textAlign="left">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <HStack width="full" justify="flex-start" fontSize="md">
                <StepIndicator step={currentStep} index={currentStepIndex} colorMode={colorMode} />
                <Text>{currentStep.labels.title}</Text>
              </HStack>
              <HStack justify="flex-end" fontSize="sm">
                {isExpanded && <GasPriceCard chain={chain} />}
                <Text whiteSpace="nowrap" color={isExpanded ? 'font.link' : 'font.highlight'}>
                  {stepLabel}
                </Text>
                <AccordionIcon textColor={isExpanded ? 'font.link' : 'font.highlight'} />
              </HStack>
            </AccordionButton>
            <AccordionPanel pt="md">
              <Steps />
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  )
}
