/* eslint-disable max-len */
'use client'

import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { useSwap } from './useSwap'
import { SwapTimeout } from './SwapTimeout'
import { DesktopStepTracker } from '../transactions/transaction-steps/step-tracker/DesktopStepTracker'
// eslint-disable-next-line max-len
import { getStylesForModalContentWithStepTracker } from '../transactions/transaction-steps/step-tracker/useStepTrackerProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { capitalize } from 'lodash'
import { SwapPreview } from './SwapPreview'

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
  const { isDesktop } = useBreakpoints()
  const initialFocusRef = useRef(null)

  const { transactionSteps, swapAction, selectedChain } = useSwap()

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
          <DesktopStepTracker transactionSteps={transactionSteps} chain={selectedChain} />
        )}
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            <span>Review {capitalize(swapAction)}</span>
            <SwapTimeout />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SwapPreview />
        </ModalBody>
        <ModalFooter>
          <VStack w="full">{transactionSteps.currentStep?.renderAction()}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
