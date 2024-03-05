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
  const initialFocusRef = useRef(null)
  const { tokenIn, tokenOut, currentStep, useOnStepCompleted, selectedChain } = useSwap()

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
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between" w="full" pr="lg">
            <Heading fontWeight="bold" size="h5">
              Review swap
            </Heading>
            <SwapTimeout />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="sm" align="start">
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
