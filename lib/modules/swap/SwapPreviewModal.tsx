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
  const { tokenIn, tokenOut, swapTxState, currentStep, useOnStepCompleted, selectedChain } =
    useSwap()

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
          <Heading fontWeight="bold" size="h5">
            Review swap
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="md" align="start">
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
              <CardHeader>You&apos;lll get (if no slippage)</CardHeader>
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
                <HStack>
                  <SwapRate />
                  <SwapTimeout swapTxState={swapTxState} />
                </HStack>
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
