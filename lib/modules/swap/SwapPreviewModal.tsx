'use client'

import {
  Card,
  CardHeader,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
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
import { useResponsive } from '@/lib/shared/hooks/useResponsive'
import { DesktopStepTracker } from '../transactions/transaction-steps/step-tracker/DesktopStepTracker'
import { MobileStepTracker } from '../transactions/transaction-steps/step-tracker/MobileStepTracker'

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
  const { isDesktop, isMobile } = useResponsive()
  const initialFocusRef = useRef(null)
  const {
    tokenIn,
    tokenOut,
    currentStep,
    currentStepIndex,
    swapStepConfigs,
    useOnStepCompleted,
    selectedChain,
    swapTxState,
  } = useSwap()

  const modalStyles: ModalContentProps = isDesktop ? { left: '-100px', position: 'relative' } : {}

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
      <ModalContent {...modalStyles}>
        {isDesktop && (
          <DesktopStepTracker currentStepIndex={currentStepIndex} stepConfigs={swapStepConfigs} />
        )}
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            <Heading fontWeight="bold" size="h5">
              Review swap
            </Heading>
            <SwapTimeout swapTxState={swapTxState} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" align="start">
            {isMobile && (
              <Card variant="level3" p="md" shadow="sm" w="full">
                <MobileStepTracker
                  currentStepIndex={currentStepIndex}
                  stepConfigs={swapStepConfigs}
                />
              </Card>
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
