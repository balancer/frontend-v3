'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
import { useDisclosure } from '@chakra-ui/hooks'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Button,
  Card,
  Center,
  HStack,
  Heading,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { Address } from 'wagmi'
import { AddLiquidityModal } from './AddLiquidityModal'
import { useAddLiquidity } from './useAddLiquidity'
import { fNum, safeTokenFormat } from '@/lib/shared/utils/numbers'
import { BPT_DECIMALS } from '../../pool.constants'

export function AddLiquidityForm() {
  const {
    humanAmountsIn: amountsIn,
    totalUSDValue,
    setHumanAmountIn: setAmountIn,
    tokens,
    validTokens,
    priceImpact,
    isPriceImpactLoading,
    bptOut,
    isPreviewQueryLoading,
    isDisabled,
    disabledReason,
  } = useAddLiquidity()
  const { toCurrency } = useCurrency()

  const previewDisclosure = useDisclosure()
  const nextBtn = useRef(null)

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => isSameAddress(amountIn.tokenAddress, tokenAddress))
    return amountIn ? amountIn.humanAmount : ''
  }

  const bptLabel = safeTokenFormat(bptOut?.amount, BPT_DECIMALS)
  const formattedPriceImpact = priceImpact ? fNum('priceImpact', priceImpact) : '-'

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack>
              <Heading fontWeight="bold" size="h5">
                Add liquidity
              </Heading>
            </HStack>
            <VStack spacing="md" w="full">
              {tokens.map(token => {
                if (!token) return <div>Missing token</div>
                return (
                  <TokenInput
                    key={token.address}
                    address={token.address}
                    chain={token.chain}
                    value={currentValueFor(token.address)}
                    onChange={e =>
                      setAmountIn(token.address as Address, e.currentTarget.value as HumanAmount)
                    }
                  />
                )
              })}
            </VStack>

            <VStack spacing="sm" align="start" w="full">
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Total</Text>
                <HStack>
                  <NumberText color="GrayText">{toCurrency(totalUSDValue)}</NumberText>
                  <Tooltip label="Total" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Price impact</Text>
                <HStack>
                  <NumberText color="GrayText">
                    {isPriceImpactLoading ? <Skeleton w="12" h="full" /> : formattedPriceImpact}
                  </NumberText>
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Bpt out</Text>
                <HStack>
                  <NumberText color="GrayText">
                    {isPreviewQueryLoading ? <Skeleton w="12" h="full" /> : bptLabel}
                  </NumberText>
                  <Tooltip label="Bpt out" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>

            <Tooltip label={isDisabled ? disabledReason : ''}>
              <Button
                ref={nextBtn}
                variant="secondary"
                w="full"
                size="lg"
                isDisabled={isDisabled}
                onClick={() => !isDisabled && previewDisclosure.onOpen()}
              >
                Next
              </Button>
            </Tooltip>
          </VStack>
        </Card>
        <AddLiquidityModal
          finalFocusRef={nextBtn}
          isOpen={previewDisclosure.isOpen}
          onOpen={previewDisclosure.onOpen}
          onClose={previewDisclosure.onClose}
        />
      </Center>
    </TokenBalancesProvider>
  )
}
