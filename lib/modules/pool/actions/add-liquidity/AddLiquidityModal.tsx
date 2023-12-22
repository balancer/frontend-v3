'use client'

import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { fNum } from '@/lib/shared/utils/numbers'
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
import { formatUnits } from 'viem'
import { Address } from 'wagmi'
import { BPT_DECIMALS } from '../../pool.constants'
import { bptUsdValue } from '../../pool.helpers'
import { usePool } from '../../usePool'
import { HumanAmountIn } from '../liquidity-types'
import { AddLiquidityFlowButton } from './AddLiquidityFlowButton'
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
  isBpt,
}: {
  tokenAddress: Address
  humanAmount: HumanAmount | ''
  symbol?: string
  isBpt?: boolean
}) {
  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()

  const token = getToken(tokenAddress, pool.chain)
  let usdValue: string | undefined
  if (isBpt) {
    usdValue = bptUsdValue(pool, humanAmount)
  } else {
    usdValue = token ? usdValueForToken(token, humanAmount) : undefined
  }

  return (
    <HStack w="full" justify="space-between">
      <HStack>
        <TokenIcon
          address={token?.address}
          chain={token?.chain}
          size={28}
          alt={token?.symbol || 'Token icon'}
        />
        <NumberText>{fNum('token', humanAmount)}</NumberText>
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
  const { humanAmountsIn, totalUSDValue, helpers, bptOut, priceImpact, tokens } = useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { pool } = usePool()
  // TODO: move userAddress up
  const spenderAddress = useContractAddress('balancer.vaultV2')
  const { userAddress } = useUserAccount()

  const bptOutLabel = bptOut ? formatUnits(bptOut.amount, BPT_DECIMALS) : '0'
  const formattedPriceImpact = priceImpact ? fNum('priceImpact', priceImpact) : '-'

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
                {tokens.map(token => {
                  if (!token) return <div>Missing token</div>

                  const amountIn = humanAmountsIn.find(amountIn =>
                    isSameAddress(amountIn.tokenAddress, token?.address)
                  ) as HumanAmountIn

                  return <TokenAmountRow key={token.address} {...amountIn} />
                })}
              </VStack>
            </Card>

            <Card variant="level0" p="md" shadow="sm" w="full">
              <VStack align="start" spacing="md">
                <HStack justify="space-between" w="full">
                  <Text color="GrayText">{"You'll get (if no slippage)"}</Text>
                </HStack>
                <TokenAmountRow
                  tokenAddress={pool.address as Address}
                  humanAmount={bptOutLabel as HumanAmount}
                  symbol="LP Token"
                  isBpt
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
            userAddress={userAddress}
            spenderAddress={spenderAddress}
            tokenAddresses={helpers.poolTokenAddresses}
          >
            <AddLiquidityFlowButton
              humanAmountsIn={humanAmountsIn}
              pool={pool}
            ></AddLiquidityFlowButton>
          </TokenAllowancesProvider>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
