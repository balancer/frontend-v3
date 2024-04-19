/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
import {
  Button,
  Card,
  Center,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { Address } from 'wagmi'
import { AddLiquidityModal } from '../AddLiquidityModal'
import { useAddLiquidity } from '../useAddLiquidity'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { TransactionSettings } from '@/lib/modules/user/settings/TransactionSettings'
import { ProportionalInputs } from './ProportionalInputs'
import { usePool } from '../../../usePool'
import { requiresProportionalInput } from '../../LiquidityActionHelpers'
import { PriceImpactAccordion } from '@/lib/shared/components/accordion/PriceImpactAccordion'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { AddLiquidityFormCheckbox } from './AddLiquidityFormCheckbox'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { isNativeOrWrappedNative, isNativeToken } from '@/lib/modules/tokens/token.helpers'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { NativeTokenSelectModal } from '@/lib/modules/tokens/NativeTokenSelectModal'

export function AddLiquidityForm() {
  const {
    humanAmountsIn: amountsIn,
    setHumanAmountIn: setAmountIn,
    tokens,
    validTokens,
    priceImpactQuery,
    simulationQuery,
    refetchQuote,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    setNeedsToAcceptHighPI,
    totalUSDValue,
    setWethIsEth,
  } = useAddLiquidity()
  const nextBtn = useRef(null)
  const { pool, totalApr } = usePool()
  const { priceImpactColor, priceImpact, setPriceImpact } = usePriceImpact()
  const { toCurrency } = useCurrency()
  const { isFlowComplete, clearCurrentFlowStep } = useCurrentFlowStep()
  const tokenSelectDisclosure = useDisclosure()

  useEffect(() => {
    setPriceImpact(priceImpactQuery.data)
  }, [priceImpactQuery.data])

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => isSameAddress(amountIn.tokenAddress, tokenAddress))
    return amountIn ? amountIn.humanAmount : ''
  }

  const priceImpactLabel =
    priceImpact !== undefined && priceImpact !== null ? fNum('priceImpact', priceImpact) : '-'

  const weeklyYield = bn(totalUSDValue).times(totalApr).div(52)

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

  useEffect(() => {
    clearCurrentFlowStep()
  }, [])

  function handleTokenSelect(token: GqlToken) {
    if (isNativeToken(token.address as Address, token.chain)) {
      setWethIsEth(true)
    } else {
      setWethIsEth(false)
    }
    setAmountIn(token.address as Address, '')
  }

  const nativeTokens = validTokens.filter(token =>
    isNativeOrWrappedNative(token.address as Address, token.chain)
  )

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        {!isFlowComplete && (
          <Card>
            <VStack spacing="md" align="start" w="full">
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
                          setAmountIn(
                            token.address as Address,
                            e.currentTarget.value as HumanAmount
                          )
                        }
                        toggleTokenSelect={
                          isNativeOrWrappedNative(token.address as Address, token.chain)
                            ? () => tokenSelectDisclosure.onOpen()
                            : undefined
                        }
                      />
                    )
                  })}
                </VStack>
              )}
              <VStack spacing="sm" align="start" w="full">
                <PriceImpactAccordion
                  isDisabled={!priceImpactQuery.data}
                  setNeedsToAcceptHighPI={setNeedsToAcceptHighPI}
                  accordionButtonComponent={
                    <HStack>
                      <Text variant="secondary" fontSize="sm" color="gray.400">
                        Price impact:{' '}
                      </Text>
                      <Text variant="secondary" fontSize="sm" color={priceImpactColor}>
                        {priceImpactLabel}
                      </Text>
                    </HStack>
                  }
                  accordionPanelComponent={
                    <PoolActionsPriceImpactDetails
                      totalUSDValue={totalUSDValue}
                      bptAmount={simulationQuery.data?.bptOut.amount}
                      isAddLiquidity
                    />
                  }
                />
              </VStack>
              <Grid w="full" templateColumns="1fr 1fr" gap="sm">
                <GridItem>
                  <Card minHeight="full" variant="subSection" w="full" p={['sm', 'ms']}>
                    <VStack align="start" gap="sm">
                      <Text fontSize="sm" lineHeight="16px" fontWeight="500">
                        Total
                      </Text>
                      <Text fontSize="md" lineHeight="16px" fontWeight="700">
                        {totalUSDValue !== '0'
                          ? toCurrency(totalUSDValue, { abbreviated: false })
                          : '-'}
                      </Text>
                    </VStack>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card variant="subSection" w="full" p={['sm', 'ms']}>
                    <VStack align="start" spacing="sm">
                      <Text variant="special" fontSize="sm" lineHeight="16px" fontWeight="500">
                        Potential weekly yield
                      </Text>
                      <HStack spacing="xs">
                        <Text variant="special" fontSize="md" lineHeight="16px" fontWeight="700">
                          {weeklyYield ? toCurrency(weeklyYield, { abbreviated: false }) : '-'}
                        </Text>
                        <Icon as={StarsIcon} />
                      </HStack>
                    </VStack>
                  </Card>
                </GridItem>
              </Grid>
              <AddLiquidityFormCheckbox />
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  ref={nextBtn}
                  variant="secondary"
                  w="full"
                  size="lg"
                  isDisabled={isDisabled}
                  onClick={() => !isDisabled && onModalOpen()}
                >
                  Next
                </Button>
              </Tooltip>
            </VStack>
          </Card>
        )}
        <AddLiquidityModal
          finalFocusRef={nextBtn}
          isOpen={previewModalDisclosure.isOpen}
          onOpen={previewModalDisclosure.onOpen}
          onClose={onModalClose}
        />
        <NativeTokenSelectModal
          chain={validTokens[0].chain}
          isOpen={tokenSelectDisclosure.isOpen}
          onOpen={tokenSelectDisclosure.onOpen}
          onClose={tokenSelectDisclosure.onClose}
          onTokenSelect={handleTokenSelect}
          nativeTokens={nativeTokens}
        />
      </Center>
    </TokenBalancesProvider>
  )
}
