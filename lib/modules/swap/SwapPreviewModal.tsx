'use client'

import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { fNum } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
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
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { useSwap } from './useSwap'
import { SwapTimeout } from './SwapTimeout'
import TokenRow from '../tokens/TokenRow/TokenRow'

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

            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text>Price impact</Text>
                  <HStack>
                    <NumberText color="grayText">{fNum('priceImpact', 0)}</NumberText>
                    <Tooltip label="Price impact" fontSize="sm">
                      <InfoOutlineIcon color="grayText" />
                    </Tooltip>
                  </HStack>
                </HStack>
                <SwapTimeout swapTxState={swapTxState} />
              </VStack>
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
