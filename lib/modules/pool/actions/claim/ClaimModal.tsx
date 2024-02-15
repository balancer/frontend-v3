import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { Pool } from '../../usePool'
import { useRef, RefObject } from 'react'
import { useClaiming } from './useClaiming'
import { Address } from 'wagmi'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
  gaugeAddresses: Address[]
  pool: Pool
}

export function ClaimModal({
  isOpen,
  onClose,
  finalFocusRef,
  gaugeAddresses,
  pool,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const initialFocusRef = useRef(null)
  const { currentStep, useOnStepCompleted } = useClaiming(gaugeAddresses, pool)

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
            Claim rewards
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalCloseButton />
        <ModalBody>Body</ModalBody>
        <ModalFooter>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
