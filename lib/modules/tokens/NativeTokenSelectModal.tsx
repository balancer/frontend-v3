'use client'

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from '@chakra-ui/react'
import { RefObject } from 'react'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokens } from './useTokens'
import { NativeTokenSelectList } from './NativeTokenSelectList'

type Props = {
  chain: GqlChain
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
  onTokenSelect: (token: GqlToken) => void
  nativeTokens: GqlToken[]
}

export function NativeTokenSelectModal({
  chain,
  isOpen,
  onClose,
  finalFocusRef,
  onTokenSelect,
  nativeTokens,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { getToken } = useTokens()

  function closeOnSelect(token: GqlToken) {
    onClose()
    onTokenSelect(token)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalFocusRef} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="font.primary">Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <VStack w="full" align="start" spacing="md">
            <Box px="md" pr="0" w="full">
              <NativeTokenSelectList tokens={nativeTokens} onTokenSelect={closeOnSelect} />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
