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
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { useAddLiquidity } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'

export function MobileStepTracker({ chain }: { chain: GqlChain }) {
  // TODO: generalize for all flows
  const { currentStep, currentTransaction, currentStepIndex, transactionSteps, isLastStep } =
    useAddLiquidity()
  const colorMode = useThemeColorMode()

  const totalSteps = transactionSteps?.length || 1

  const stepLabel = `Step ${currentStepIndex + 1}/${totalSteps}`

  return (
    <Accordion width="full" variant="button" allowToggle textAlign="left">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <HStack width="full" justify="flex-start" fontSize="md">
                {currentStep && (
                  <StepIndicator
                    transaction={currentTransaction}
                    currentIndex={currentStepIndex}
                    index={currentStepIndex}
                    step={currentStep}
                    colorMode={colorMode}
                    isLastStep={isLastStep(currentStepIndex)}
                  />
                )}
                <Text>{currentStep?.labels.title}</Text>
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
