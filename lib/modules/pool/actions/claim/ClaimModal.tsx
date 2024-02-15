import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import {
  Heading,
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
import { Pool } from '../../usePool'
import { useClaiming } from './useClaiming'
import { Address } from 'wagmi'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  gaugeAddresses: Address[]
  pool: Pool
}

export function ClaimModal({
  isOpen,
  onClose,
  gaugeAddresses,
  pool,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { currentStep, useOnStepCompleted } = useClaiming(gaugeAddresses, pool)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontWeight="bold" size="h5">
            Claim rewards
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>Body</ModalBody>
        <ModalFooter>
          <VStack w="full">{currentStep.render(useOnStepCompleted)}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
