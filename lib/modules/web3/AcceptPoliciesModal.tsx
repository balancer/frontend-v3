'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  UnorderedList,
  ListItem,
  Checkbox,
  Button,
  VStack,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useUserSettings } from '../user/settings/useUserSettings'
import { useUserAccount } from './useUserAccount'

export function AcceptPoliciesModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { acceptedPolicies, setAcceptedPolicies } = useUserSettings()
  const { isBlocked, isLoading, isConnected } = useUserAccount()

  useEffect(() => {
    if (!isLoading && isConnected && !acceptedPolicies && !isBlocked) onOpen()
  }, [acceptedPolicies, isBlocked, isLoading, isConnected])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Accept Balancer UI policies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="flex-start" gap="md">
            <Text>By connecting a wallet, you agree to Balancer Foundation’s:</Text>
            <UnorderedList>
              <ListItem>Terms of Use</ListItem>
              <ListItem>Privacy Policy</ListItem>
              <ListItem>Cookies Policy</ListItem>
              <ListItem>Risks</ListItem>
              <ListItem>3rd party services</ListItem>
            </UnorderedList>
            <Checkbox
              size="lg"
              isChecked={acceptedPolicies}
              onChange={e => setAcceptedPolicies(e.target.checked)}
            >
              <Text fontSize="md">I agree</Text>
            </Checkbox>
            <Button
              variant="secondary"
              w="full"
              size="lg"
              isDisabled={!acceptedPolicies}
              onClick={() => onClose()}
            >
              Proceed
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
