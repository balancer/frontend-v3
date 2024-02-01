'use client'

import {
  Card,
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { RefObject, useRef } from 'react'
import { fNum } from '@/lib/shared/utils/numbers'
import { usePool } from '../../../usePool'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { FiArrowLeft } from 'react-icons/fi'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Address } from 'viem'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import RemoveLiquidityBptRow from './RemoveLiquidityBptRow'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { RemoveLiquidityTimeout } from './RemoveLiquidityTimeout'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

export function RemoveLiquidityModal({
  isOpen,
  onClose,
  finalFocusRef,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const initialFocusRef = useRef(null)
  const {
    isProportional,
    isSingleToken,
    singleTokenOutAddress,
    amountOutForToken,
    priceImpactQuery,
    removeLiquidityTxState,
    currentStep,
    useOnStepCompleted,
  } = useRemoveLiquidity()
  const { pool } = usePool()
  const { slippage } = useUserSettings()

  const priceImpact = priceImpactQuery?.data
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-'

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
          <HStack>
            <Icon as={FiArrowLeft} aria-label="back" />
            <Heading fontWeight="bold" size="h5">
              Remove liquidity
            </Heading>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="md" align="start">
            <Card variant="level0" p="md" w="full">
              <VStack align="start" spacing="md">
                <Text fontWeight="bold" fontSize="1rem">
                  You&apos;re removing
                </Text>
                <RemoveLiquidityBptRow pool={pool} />
              </VStack>
            </Card>
            <Card variant="level0" p="md" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold" fontSize="1rem">
                    You&apos;ll get at least
                  </Text>
                  <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                    With max slippage: {fNum('slippage', slippage)}
                  </Text>
                </HStack>
                {isProportional &&
                  pool.displayTokens.map(token => (
                    <TokenRow
                      key={token.address}
                      address={token.address as Address}
                      chain={pool.chain}
                      value={amountOutForToken(token.address as Address)}
                    />
                  ))}
                {isSingleToken && (
                  <TokenRow
                    address={singleTokenOutAddress as Address}
                    chain={pool.chain}
                    value={amountOutForToken(singleTokenOutAddress as Address)}
                  />
                )}
              </VStack>
            </Card>
            <Card variant="level0" p="md" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium" variant="secondary">
                    Price impact
                  </Text>
                  <HStack>
                    {priceImpactQuery.isLoading ? (
                      <Skeleton w="12" h="full" />
                    ) : (
                      <NumberText color="GrayText">{priceImpactLabel}</NumberText>
                    )}
                    <Tooltip label="Price impact" fontSize="sm">
                      <InfoOutlineIcon color="GrayText" />
                    </Tooltip>
                  </HStack>
                </HStack>

                <VStack align="start" spacing="md">
                  <HStack justify="space-between" w="full">
                    <RemoveLiquidityTimeout removeLiquidityTxState={removeLiquidityTxState} />
                  </HStack>
                </VStack>
              </VStack>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack w="full">{currentStep.Render(useOnStepCompleted)}</VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
