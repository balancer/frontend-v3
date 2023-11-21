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
} from '@chakra-ui/react'
import { RefObject, useRef, useState } from 'react'
import { TokenSelectList } from './TokenSelectList/TokenSelectList'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'

type Props = {
  tokens: GqlToken[]
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef: RefObject<HTMLInputElement>
  onTokenSelect: (token: GqlToken) => void
}

export function TokenSelectModal({
  tokens,
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

    setTimeout(() => {
      onTokenSelect(token)
      setSearchTerm('')
    })
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
        <ModalHeader>Select a token</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <Box px="md">
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search name, symbol or address"
            />
          </Box>
          <Box p="md" pr="0">
            <TokenSelectList
              tokens={tokens}
              listHeight={500}
              searchTerm={searchTerm}
              onTokenSelect={closeOnSelect}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
