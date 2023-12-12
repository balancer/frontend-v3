'use client'

import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { tokenFormat } from '@/lib/shared/utils/numbers'
import { HumanAmount } from '@balancer/sdk'
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
import { usePool } from '../../usePool'
import { AddLiquidityFlowButton, HumanAmountInWithTokenInfo } from './AddLiquidityFlowButton'
import { useAddLiquidity } from './useAddLiquidity'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  finalFocusRef?: RefObject<HTMLInputElement>
}

function TokenAmountRow({
  tokenAddress,
  humanAmount,
  symbol,
}: {
  tokenAddress: Address
  humanAmount: HumanAmount | ''
  symbol?: string
}) {
  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()

  const token = getToken(tokenAddress, pool.chain)
  const usdValue = token ? usdValueForToken(token, humanAmount) : undefined

  return (
    <HStack w="full" justify="space-between">
      <HStack>
        <TokenIcon
          address={token?.address}
          chain={token?.chain}
          size={28}
          alt={token?.symbol || 'Token icon'}
        />
        <NumberText>{tokenFormat(humanAmount)}</NumberText>
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
  const { amountsIn, totalUSDValue, poolTokenAddresses, formattedPriceImpact, bptOutUnits } =
    useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { pool } = usePool()
  // TODO: move userAddress up
  const spenderAddress = useContractAddress('balancer.vaultV2') || emptyAddress
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()
  const humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[] = amountsIn.map(humanAmountIn => {
    return {
      ...humanAmountIn,
      ...getToken(humanAmountIn.tokenAddress, pool.chain),
    } as HumanAmountInWithTokenInfo
  })

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
                <TokenAmountRow
                  tokenAddress={pool.address as Address}
                  humanAmount={bptOutUnits}
                  symbol="LP Token"
                />
              </VStack>
            </Card>

            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text>Price impact</Text>
                  <HStack>
                    <NumberText color="GrayText">{formattedPriceImpact}</NumberText>
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
          <TokenAllowancesProvider
            userAddress={userAddress || emptyAddress}
            spenderAddress={spenderAddress}
            tokenAddresses={poolTokenAddresses}
          >
            <AddLiquidityFlowButton
              humanAmountsInWithTokenInfo={humanAmountsInWithTokenInfo}
            ></AddLiquidityFlowButton>
          </TokenAllowancesProvider>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
