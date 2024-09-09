'use client'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalProps,
  Center,
} from '@chakra-ui/react'
import { SwapRoutesChart } from '../charts/SwapRoutesChart'

type Props = {
  isOpen: boolean
  onClose(): void
}

export function SwapRoutesModal({ isOpen, onClose }: Props & Omit<ModalProps, 'children'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
      <ModalContent>
        <ModalHeader>Swap routes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <SwapRoutesChart />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
