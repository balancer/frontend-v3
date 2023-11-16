'use client'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { TokenSelectList } from './TokenSelectList/TokenSelectList'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef: RefObject<HTMLInputElement>
}

export function TokenSelectModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const initialFocusRef = useRef(null)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      {...rest}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody pr={0}>
          <TokenSelectList listHeight={500} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
