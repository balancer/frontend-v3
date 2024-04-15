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
import { getNativeAssetAddress, getWrappedNativeAssetAddress } from '@/lib/config/app.config'
import { useTokens } from './useTokens'
import { NativeTokenSelectList } from './NativeTokenSelectList'

type Props = {
  title: string
  chain: GqlChain
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
  onTokenSelect: (token: GqlToken) => void
}

export function NativeTokenSelectModal({
  title,
  chain,
  isOpen,
  onClose,
  finalFocusRef,
  onTokenSelect,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const { getToken } = useTokens()

  function closeOnSelect(token: GqlToken) {
    onClose()
    onTokenSelect(token)
  }

  const eth = getToken(getNativeAssetAddress(chain), chain)
  const weth = getToken(getWrappedNativeAssetAddress(chain), chain)
  const nativeTokens = eth && weth ? [eth, weth] : []

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalFocusRef} isCentered {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="font.primary">{title}</ModalHeader>
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
