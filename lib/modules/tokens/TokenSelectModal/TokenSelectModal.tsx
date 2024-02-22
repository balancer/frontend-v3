'use client'

import {
  Box,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef, useState } from 'react'
import { TokenSelectList } from './TokenSelectList/TokenSelectList'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { TokenSelectPopular } from './TokenSelectPopular'

type Props = {
  tokens: GqlToken[]
  chain: GqlChain
  excludeNativeAsset?: boolean
  pinNativeAsset?: boolean
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
  onTokenSelect: (token: GqlToken) => void
}

export function TokenSelectModal({
  tokens,
  chain,
  excludeNativeAsset = false,
  pinNativeAsset = false,
  isOpen,
  onClose,
  finalFocusRef,
  onTokenSelect,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const [searchTerm, setSearchTerm] = useState('')

  const initialFocusRef = useRef(null)

  function closeOnSelect(token: GqlToken) {
    onClose()

    onTokenSelect(token)
    setSearchTerm('')
  }

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
        <ModalHeader color="font.primary">Select a token</ModalHeader>
        <ModalCloseButton color="font.primary" rounded="full" />
        <ModalBody p={0}>
          <VStack w="full" align="start" spacing="md">
            <Box px="md" w="full">
              <Input
                ref={initialFocusRef}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, symbol or address"
              />
            </Box>
            {!searchTerm && (
              <Box px="md" w="full">
                <TokenSelectPopular
                  chain={chain}
                  excludeNativeAsset={excludeNativeAsset}
                  onTokenSelect={closeOnSelect}
                />
              </Box>
            )}
            <Box px="md" pr="0" w="full">
              <TokenSelectList
                tokens={tokens}
                excludeNativeAsset={excludeNativeAsset}
                pinNativeAsset={pinNativeAsset}
                listHeight={500}
                searchTerm={searchTerm}
                onTokenSelect={closeOnSelect}
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
