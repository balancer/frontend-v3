/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
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
import { Address } from 'viem'
import { AddLiquidityModal } from '../AddLiquidityModal'
import { useAddLiquidity } from '../useAddLiquidity'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { TransactionSettings } from '@/lib/modules/user/settings/TransactionSettings'
import { TokenInputs } from './TokenInputs'
import { usePool } from '../../../usePool'
import { requiresProportionalInput } from '../../LiquidityActionHelpers'
import { PriceImpactAccordion } from '@/lib/shared/components/accordion/PriceImpactAccordion'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { AddLiquidityFormCheckbox } from './AddLiquidityFormCheckbox'
import { useTransactionFlow } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'
import { isNativeOrWrappedNative, isNativeAsset } from '@/lib/modules/tokens/token.helpers'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { NativeAssetSelectModal } from '@/lib/modules/tokens/NativeAssetSelectModal'
import { useTokenInputsValidation } from '@/lib/modules/tokens/useTokenInputsValidation'

export function AddLiquidityForm() {
  const {
    setHumanAmountIn: setAmountIn,
    validTokens,
    priceImpactQuery,
    simulationQuery,
    refetchQuote,
    isDisabled,
    disabledReason,
    showAcceptPoolRisks,
    previewModalDisclosure,
    setNeedsToAcceptHighPI,
    totalUSDValue,
    setWethIsEth,
  } = useAddLiquidity()

  const nextBtn = useRef(null)
  const { pool, totalApr } = usePool()
  const { priceImpactColor, priceImpact, setPriceImpact } = usePriceImpact()
  const { toCurrency } = useCurrency()
  const tokenSelectDisclosure = useDisclosure()
  const { setValidationError } = useTokenInputsValidation()

  useEffect(() => {
    setPriceImpact(priceImpactQuery.data)
  }, [priceImpactQuery.data])

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

  const nativeAssets = validTokens.filter(token =>
    isNativeOrWrappedNative(token.address as Address, token.chain)
  )

  function handleTokenSelect(token: GqlToken) {
    if (isNativeAsset(token.address as Address, token.chain)) {
      setWethIsEth(true)
    } else {
      setWethIsEth(false)
    }
    setAmountIn(token.address as Address, '')

    // reset any validation errors for native assets
    nativeAssets.forEach(nativeAsset => {
      setValidationError(nativeAsset.address as Address, '')
    })
  }

  return (
    <TokenBalancesProvider extTokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card>
          <VStack spacing="md" align="start" w="full">
            <HStack w="full" justify="space-between">
              <Heading fontWeight="bold" size="h5">
                Add liquidity
              </Heading>
              <TransactionSettings size="sm" />
            </HStack>
            <TokenInputs
              tokenSelectDisclosureOpen={() => tokenSelectDisclosure.onOpen()}
              requiresProportionalInput={requiresProportionalInput(pool.type)}
              totalUSDValue={totalUSDValue}
            />
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
                      {pool.staking && <Icon as={StarsIcon} />}
                    </HStack>
                  </VStack>
                </Card>
              </GridItem>
            </Grid>
            {showAcceptPoolRisks && <AddLiquidityFormCheckbox />}
            <Tooltip label={isDisabled ? disabledReason : ''}>
              <Button
                ref={nextBtn}
                variant="secondary"
                w="full"
                size="lg"
                isDisabled={isDisabled}
                isLoading={simulationQuery.isLoading || priceImpactQuery.isLoading}
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
        {!!validTokens.length && (
          <NativeAssetSelectModal
            chain={validTokens[0].chain}
            isOpen={tokenSelectDisclosure.isOpen}
            onOpen={tokenSelectDisclosure.onOpen}
            onClose={tokenSelectDisclosure.onClose}
            onTokenSelect={handleTokenSelect}
            nativeAssets={nativeAssets}
          />
        )}
      </Center>
    </TokenBalancesProvider>
  )
}
