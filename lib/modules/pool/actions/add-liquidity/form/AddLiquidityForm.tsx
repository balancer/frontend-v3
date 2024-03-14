'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
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
import { AddLiquidityModal } from '../AddLiquidityModal'
import { useAddLiquidity } from '../useAddLiquidity'
import { fNum, safeTokenFormat } from '@/lib/shared/utils/numbers'
import { BPT_DECIMALS } from '../../../pool.constants'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { TransactionSettings } from '@/lib/modules/user/settings/TransactionSettings'
import { ProportionalInputs } from './ProportionalInputs'
import { usePool } from '../../../usePool'
import { requiresProportionalInput } from '../../LiquidityActionHelpers'
import { Info } from 'react-feather'

export function AddLiquidityForm() {
  const {
    humanAmountsIn: amountsIn,
    totalUSDValue,
    setHumanAmountIn: setAmountIn,
    tokens,
    validTokens,
    priceImpactQuery,
    simulationQuery,
    refetchQuote,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
  } = useAddLiquidity()
  const { toCurrency } = useCurrency()
  const { slippage } = useUserSettings()
  const nextBtn = useRef(null)
  const { pool } = usePool()

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => isSameAddress(amountIn.tokenAddress, tokenAddress))
    return amountIn ? amountIn.humanAmount : ''
  }

  const bptOut = simulationQuery?.data?.bptOut
  const bptOutLabel = safeTokenFormat(bptOut?.amount, BPT_DECIMALS, { abbreviated: false })

  const priceImpact = priceImpactQuery?.data
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-'

  const onModalOpen = async () => {
    previewModalDisclosure.onOpen()
    if (requiresProportionalInput(pool.type)) {
      // Edge-case refetch to avoid mismatches in proportional bptOut calculations
      await refetchQuote()
    }
  }

  const onModalClose = () => {
    previewModalDisclosure.onClose()
  }

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level2" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start" w="full">
            <HStack w="full" justify="space-between">
              <Heading fontWeight="bold" size="h5">
                Add liquidity
              </Heading>
              <TransactionSettings size="sm" />
            </HStack>

            {requiresProportionalInput(pool.type) ? (
              <ProportionalInputs />
            ) : (
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
            )}

            <VStack spacing="sm" align="start" w="full" px="md">
              <HStack justify="space-between" w="full">
                <Text color="grayText">Total</Text>
                <HStack textColor="grayText">
                  <NumberText color="grayText">
                    {toCurrency(totalUSDValue, { abbreviated: false })}
                  </NumberText>
                  <Tooltip
                    label={`Total value of tokens being added. Does not include potential slippage (${fNum(
                      'slippage',
                      slippage
                    )}).`}
                    fontSize="sm"
                  >
                    <Info size={16} />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="grayText">LP tokens</Text>
                <HStack textColor="grayText">
                  {simulationQuery.isLoading ? (
                    <Skeleton w="16" h="6" />
                  ) : (
                    <NumberText color="grayText">{bptOutLabel}</NumberText>
                  )}
                  <Tooltip
                    label={`LP tokens you are expected to receive. Does not include potential slippage (${fNum(
                      'slippage',
                      slippage
                    )}).`}
                    fontSize="sm"
                  >
                    <Info size={16} />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="grayText">Price impact</Text>
                <HStack textColor="grayText">
                  {priceImpactQuery.isLoading ? (
                    <Skeleton w="16" h="6" />
                  ) : (
                    <NumberText color="grayText">{priceImpactLabel}</NumberText>
                  )}
                  <Tooltip
                    label="Adding unbalanced amounts causes the internal prices of the pool to change,
                    as if you were swapping tokens. The higher the price impact the more you'll spend in swap fees."
                    fontSize="sm"
                  >
                    <Info size={16} />
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
                onClick={() => !isDisabled && onModalOpen()}
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
