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
  ModalFooter,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useUserSettings } from '../user/settings/useUserSettings'
import { useUserAccount } from './useUserAccount'
import { useDisconnect } from 'wagmi'

export function AcceptPoliciesModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { acceptedPolicies, setAcceptedPolicies } = useUserSettings()
  const { isBlocked, isLoading, isConnected, userAddress } = useUserAccount()
  const [isChecked, setIsChecked] = useState(false)
  const { disconnect } = useDisconnect()

  const isAddressInAcceptedPolicies = acceptedPolicies.includes(userAddress.toLowerCase())

  useEffect(() => {
    if (!isLoading && isConnected && !isAddressInAcceptedPolicies && !isBlocked) onOpen()
  }, [acceptedPolicies, isBlocked, isLoading, isConnected, userAddress])

  //disconnect wallet if modal is closed without accepting & clicking 'Proceed'
  useEffect(() => {
    if (!isOpen && !acceptedPolicies.includes(userAddress.toLowerCase())) {
      disconnect()
    }
  }, [isOpen])

  function handleOnClose() {
    setIsChecked(false)
    onClose()
  }
  function handleClick() {
    // just check we don't already have it
    if (!isAddressInAcceptedPolicies)
      setAcceptedPolicies([...acceptedPolicies, userAddress.toLowerCase()])
    handleOnClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Accept Balancer UI policies</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="flex-start" gap="md">
            <Text>By connecting a wallet, you agree to Balancer Foundation’s:</Text>
            <UnorderedList color="font.primary">
              <ListItem>Terms of Use</ListItem>
              <ListItem>Privacy Policy</ListItem>
              <ListItem>Cookies Policy</ListItem>
              <ListItem>Risks</ListItem>
              <ListItem>3rd party services</ListItem>
            </UnorderedList>
            <Checkbox
              size="lg"
              isChecked={isChecked}
              onChange={e => setIsChecked(e.target.checked)}
            >
              <Text fontSize="md">I agree</Text>
            </Checkbox>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            w="full"
            size="lg"
            isDisabled={!isChecked}
            onClick={handleClick}
          >
            Proceed
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
