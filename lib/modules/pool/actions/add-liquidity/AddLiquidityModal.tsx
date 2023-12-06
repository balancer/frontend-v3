'use client'

import {
  Button,
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
import { useAddLiquidity } from './useAddLiquidity'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { usePool } from '../../usePool'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { priceImpactFormat, tokenFormat } from '@/lib/shared/utils/numbers'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

function TokenAmountRow({
  tokenAddress,
  value,
  symbol,
}: {
  tokenAddress: string
  value: string
  symbol?: string
}) {
  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()

  const token = getToken(tokenAddress, pool.chain)
  const usdValue = token ? usdValueForToken(token, value) : undefined

  return (
    <HStack w="full" justify="space-between">
      <HStack>
        <TokenIcon
          address={token?.address}
          chain={token?.chain}
          size={28}
          alt={token?.symbol || 'Token icon'}
        />
        <NumberText>{tokenFormat(value)}</NumberText>
        <Text>{symbol || token?.symbol}</Text>
      </HStack>
      <NumberText>{usdValue ? toCurrency(usdValue) : '-'}</NumberText>
    </HStack>
  )
}

export function AddLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const initialFocusRef = useRef(null)
  const { amountsIn, totalUSDValue, executeAddLiquidity } = useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { pool } = usePool()

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
            Add liquidity
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="md" align="start">
            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text color="GrayText">{"You're adding"}</Text>
                  <NumberText fontSize="lg">{toCurrency(totalUSDValue)}</NumberText>
                </HStack>
                {amountsIn.map(amountIn => (
                  <TokenAmountRow key={amountIn.tokenAddress} {...amountIn} />
                ))}
              </VStack>
            </Card>

            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text color="GrayText">{"You'll get (if no slippage)"}</Text>
                  <Text color="GrayText">{pool.symbol}</Text>
                </HStack>
                <TokenAmountRow tokenAddress={pool.address} value="0" symbol="LP Token" />
              </VStack>
            </Card>

            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text>Price impact</Text>
                  <HStack>
                    <NumberText color="GrayText">{priceImpactFormat(0)}</NumberText>
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
          <Button w="full" size="lg" variant="primary" onClick={executeAddLiquidity}>
            Add liquidity
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
