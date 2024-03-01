'use client'

import {
  Box,
  Card,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react'
import { RefObject, useState } from 'react'
import { TokenSelectList } from './TokenSelectList/TokenSelectList'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { TokenSelectPopular } from './TokenSelectPopular'
import { TbWallet, TbCoins } from 'react-icons/tb'
import { useUserAccount } from '../../web3/useUserAccount'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { SearchInput } from '@/lib/shared/components/inputs/SearchInput'

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
  const { isConnected } = useUserAccount()
  const { openConnectModal } = useConnectModal()

  function closeOnSelect(token: GqlToken) {
    onClose()
    onTokenSelect(token)
    setSearchTerm('')
  }

  const tokenSelectListProps = {
    tokens,
    excludeNativeAsset,
    pinNativeAsset,
    listHeight: 250,
    searchTerm,
    onTokenSelect: closeOnSelect,
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalFocusRef} {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="font.primary">Select a token</ModalHeader>
        <ModalCloseButton color="font.primary" rounded="full" />
        <ModalBody p={0}>
          <VStack w="full" align="start" spacing="md">
            <Box px="md" w="full">
              <SearchInput
                search={searchTerm}
                setSearch={setSearchTerm}
                placeholder="Search by name, symbol or address"
                ariaLabel="search for a token"
                tabIndex={1}
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
              <Card p="1" mr="4" mb="4">
                <HStack>
                  <Box color="font.secondary">
                    <TbWallet />
                  </Box>
                  <Text color="font.secondary">In your wallet</Text>
                  {!isConnected && (
                    <Button ml="auto" variant="link" color="purple.300" onClick={openConnectModal}>
                      Connect wallet
                    </Button>
                  )}
                </HStack>
              </Card>
              {isConnected && <TokenSelectList {...tokenSelectListProps} showTokensWithBalance />}
              <Card p="1" mr="4" mb="4">
                <HStack>
                  <Box color="font.secondary">
                    <TbCoins />
                  </Box>
                  <Text color="font.secondary">Other tokens</Text>
                </HStack>
              </Card>
              <TokenSelectList {...tokenSelectListProps} />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
