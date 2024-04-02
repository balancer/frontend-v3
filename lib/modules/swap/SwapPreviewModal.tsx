/* eslint-disable max-len */
'use client'

import {
  Card,
  CardHeader,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { useSwap } from './useSwap'
import { SwapTimeout } from './SwapTimeout'
import TokenRow from '../tokens/TokenRow/TokenRow'
import { SwapDetails } from './SwapDetails'
import { SwapRate } from './SwapRate'
import { DesktopStepTracker } from '../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '../transactions/transaction-steps/step-tracker/MobileStepTracker'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { capitalize } from 'lodash'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function SwapPreviewModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { isDesktop, isMobile } = useBreakpoints()
  const initialFocusRef = useRef(null)
  const {
    tokenIn,
    tokenOut,
    currentStep,
    currentStepIndex,
    swapStepConfigs,
    swapAction,
    selectedChain,
    useOnStepCompleted,
  } = useSwap()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isCentered
      {...rest}
    >
      <ModalOverlay />
      <ModalContent {...getStylesForModalContentWithStepTracker(isDesktop)}>
        {isDesktop && (
          <DesktopStepTracker
            currentStepIndex={currentStepIndex}
            stepConfigs={swapStepConfigs}
            chain={selectedChain}
          />
        )}
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            <span>Review {capitalize(swapAction)}</span>
            <SwapTimeout />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" align="start">
            {isMobile && (
              <MobileStepTracker
                currentStepIndex={currentStepIndex}
                stepConfigs={swapStepConfigs}
                chain={selectedChain}
              />
            )}
            <Card variant="modalSubSection">
              <CardHeader>You pay</CardHeader>
              <TokenRow
                address={tokenIn.address}
                value={tokenIn.amount}
                chain={selectedChain}
                abbreviated={false}
              />
            </Card>

            <Card variant="modalSubSection">
              <CardHeader>You&apos;ll get (if no slippage)</CardHeader>
              <TokenRow
                address={tokenOut.address}
                value={tokenOut.amount}
                chain={selectedChain}
                abbreviated={false}
              />
            </Card>

            <Card variant="modalSubSection">
              <SwapDetails />
            </Card>

            <Card variant="modalSubSection" fontSize="sm">
              <HStack justify="space-between" w="full">
                <Text color="grayText">Exchange rate</Text>
                <SwapRate />
              </HStack>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
