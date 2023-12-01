'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { useAddLiquidity } from './useAddLiquidity'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function AddLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const initialFocusRef = useRef(null)
  const { amountsIn } = useAddLiquidity()

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
        <ModalHeader>Add liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="xs">
          <pre>{JSON.stringify(amountsIn, null, 2)}</pre>
        </ModalBody>
        <ModalFooter>
          <Button w="full" size="lg" variant="primary">
            Add liquidity
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
