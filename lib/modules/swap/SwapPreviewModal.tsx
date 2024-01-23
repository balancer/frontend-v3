'use client'

import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Card,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { Address } from 'wagmi'
import { useSwap } from './useSwap'
import { SwapFlowButton } from './SwapFlowButton'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

function TokenAmountRow({ address, amount }: { address: Address; amount: string }) {
  const { selectedChain } = useSwap()
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()

  const token = getToken(address, selectedChain)
  const usdValue = token ? usdValueForToken(token, amount) : undefined

  return (
    <HStack w="full" justify="space-between">
      <HStack>
        <TokenIcon
          address={token?.address}
          chain={token?.chain}
          size={28}
          alt={token?.symbol || 'Token icon'}
        />
        <NumberText>{fNum('token', amount)}</NumberText>
        <Text>{token?.symbol}</Text>
      </HStack>
      <NumberText>{usdValue ? toCurrency(usdValue) : '-'}</NumberText>
    </HStack>
  )
}

export function SwapPreviewModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const initialFocusRef = useRef(null)
  const { tokenIn, tokenOut } = useSwap()

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
            Swap preview
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="md" align="start">
            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <TokenAmountRow {...tokenIn} />
                <TokenAmountRow {...tokenOut} />
              </VStack>
            </Card>

            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text>Price impact</Text>
                  <HStack>
                    <NumberText color="GrayText">{fNum('priceImpact', 0)}</NumberText>
                    <Tooltip label="Price impact" fontSize="sm">
                      <InfoOutlineIcon color="GrayText" />
                    </Tooltip>
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <SwapFlowButton />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
