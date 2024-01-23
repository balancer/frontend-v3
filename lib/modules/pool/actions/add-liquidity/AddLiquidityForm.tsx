'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
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
    priceImpactQuery,
    simulationQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    deactivateStep,
  } = useAddLiquidity()
  const { toCurrency } = useCurrency()

  const nextBtn = useRef(null)

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => isSameAddress(amountIn.tokenAddress, tokenAddress))
    return amountIn ? amountIn.humanAmount : ''
  }

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = safeTokenFormat(bptOut?.amount, BPT_DECIMALS)
  const priceImpact = priceImpactQuery?.data
  const formattedPriceImpact = priceImpact ? fNum('priceImpact', priceImpact) : '-'

  const onModalClose = () => {
    previewModalDisclosure.onClose()
    deactivateStep()
  }

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
                  {priceImpactQuery.isLoading ? (
                    <Skeleton w="12" h="full" />
                  ) : (
                    <NumberText color="GrayText">{formattedPriceImpact}</NumberText>
                  )}
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Bpt out</Text>
                <HStack>
                  {simulationQuery.isLoading ? (
                    <Skeleton w="12" h="full" />
                  ) : (
                    <NumberText color="GrayText">{bptOutLabel}</NumberText>
                  )}
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
                isDisabled={isDisabled || simulationQuery.isLoading}
                onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
              >
                Next
              </Button>
            </Tooltip>
          </VStack>
        </Card>
        <AddLiquidityModal
          finalFocusRef={nextBtn}
          isOpen={previewModalDisclosure.isOpen}
          onOpen={previewModalDisclosure.onOpen}
          onClose={onModalClose}
        />
      </Center>
    </TokenBalancesProvider>
  )
}
