/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { TokenBalancesProvider, useTokenBalances } from '@/lib/modules/tokens/TokenBalancesProvider'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  GridItem,
  HStack,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { Address } from 'viem'
import { AddLiquidityModal } from '../modal/AddLiquidityModal'
import { useAddLiquidity } from '../AddLiquidityProvider'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { TransactionSettings } from '@/lib/modules/user/settings/TransactionSettings'
import { TokenInputs } from './TokenInputs'
import { TokenInputsWithAddable } from './TokenInputsWithAddable'
import { usePool } from '../../../PoolProvider'
import { requiresProportionalInput, supportsProportionalAdds } from '../../LiquidityActionHelpers'
import { PriceImpactAccordion } from '@/lib/modules/price-impact/PriceImpactAccordion'
import { PoolActionsPriceImpactDetails } from '../../PoolActionsPriceImpactDetails'
import { usePriceImpact } from '@/lib/modules/price-impact/PriceImpactProvider'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { AddLiquidityFormCheckbox } from './AddLiquidityFormCheckbox'
import { isNativeOrWrappedNative, isNativeAsset } from '@/lib/modules/tokens/token.helpers'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { NativeAssetSelectModal } from '@/lib/modules/tokens/NativeAssetSelectModal'
import { useTokenInputsValidation } from '@/lib/modules/tokens/TokenInputsValidationProvider'
import { GenericError } from '@/lib/shared/components/errors/GenericError'
import { PriceImpactError } from '../../../../price-impact/PriceImpactError'
import AddLiquidityAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AddLiquidityAprTooltip'
import { calcPotentialYieldFor } from '../../../pool.utils'
import { cannotCalculatePriceImpactError } from '@/lib/modules/price-impact/price-impact.utils'
import { useModalWithPoolRedirect } from '../../../useModalWithPoolRedirect'

// small wrapper to prevent out of context error
export function AddLiquidityForm() {
  const { validTokens } = useAddLiquidity()

  return (
    <TokenBalancesProvider extTokens={validTokens}>
      <AddLiquidityMainForm />
    </TokenBalancesProvider>
  )
}

function AddLiquidityMainForm() {
  const {
    setHumanAmountIn: setAmountIn,
    validTokens,
    priceImpactQuery,
    simulationQuery,
    isDisabled,
    disabledReason,
    showAcceptPoolRisks,
    totalUSDValue,
    addLiquidityTxHash,
    setNeedsToAcceptHighPI,
    refetchQuote,
    setWethIsEth,
    nativeAsset,
    wNativeAsset,
  } = useAddLiquidity()

  const nextBtn = useRef(null)
  const { pool } = usePool()
  const { priceImpactColor, priceImpact, setPriceImpact } = usePriceImpact()
  const { toCurrency } = useCurrency()
  const tokenSelectDisclosure = useDisclosure()
  const { setValidationError } = useTokenInputsValidation()
  const { balanceFor, isBalancesLoading } = useTokenBalances()

  useEffect(() => {
    setPriceImpact(priceImpactQuery.data)
  }, [priceImpactQuery.data])

  const priceImpactLabel =
    priceImpact !== undefined && priceImpact !== null ? fNum('priceImpact', priceImpact) : '-'

  const weeklyYield = calcPotentialYieldFor(pool, totalUSDValue)

  const previewModalDisclosure = useModalWithPoolRedirect(pool, addLiquidityTxHash)

  const onModalOpen = async () => {
    previewModalDisclosure.onOpen()
    if (requiresProportionalInput(pool.type)) {
      // Edge-case refetch to avoid mismatches in proportional bptOut calculations
      await refetchQuote()
    }
  }

  const nativeAssets = validTokens.filter(token =>
    isNativeOrWrappedNative(token.address as Address, token.chain)
  )

  // if native asset balance is higher set that asset as the 'default'
  useEffect(() => {
    if (!isBalancesLoading && nativeAsset && wNativeAsset) {
      const nativeAssetBalance = balanceFor(nativeAsset.address)
      const wNativeAssetBalance = balanceFor(wNativeAsset.address)
      if (
        nativeAssetBalance &&
        wNativeAssetBalance &&
        bn(nativeAssetBalance.amount).gt(bn(wNativeAssetBalance.amount))
      ) {
        setWethIsEth(true)
      }
    }
  }, [isBalancesLoading])

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

  useEffect(() => {
    if (addLiquidityTxHash) {
      previewModalDisclosure.onOpen()
    }
  }, [addLiquidityTxHash])

  return (
    <Box w="full" maxW="lg" mx="auto">
      <Card>
        <CardHeader>
          <HStack w="full" justify="space-between">
            <span>Add liquidity</span>
            <TransactionSettings size="sm" />
          </HStack>
        </CardHeader>
        <VStack spacing="md" align="start" w="full">
          {supportsProportionalAdds(pool) ? (
            <TokenInputsWithAddable
              tokenSelectDisclosureOpen={() => tokenSelectDisclosure.onOpen()}
              requiresProportionalInput={requiresProportionalInput(pool.type)}
              totalUSDValue={totalUSDValue}
            />
          ) : (
            <TokenInputs tokenSelectDisclosureOpen={() => tokenSelectDisclosure.onOpen()} />
          )}
          <VStack spacing="sm" align="start" w="full">
            <PriceImpactAccordion
              isDisabled={!priceImpactQuery.data}
              cannotCalculatePriceImpact={cannotCalculatePriceImpactError(priceImpactQuery.error)}
              setNeedsToAcceptPIRisk={setNeedsToAcceptHighPI}
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
              <AddLiquidityAprTooltip
                aprItems={pool.dynamicData.aprItems}
                totalUsdValue={totalUSDValue}
                weeklyYield={weeklyYield}
                pool={pool}
              />
            </GridItem>
          </Grid>
          {showAcceptPoolRisks && <AddLiquidityFormCheckbox />}
          {priceImpactQuery.isError && <PriceImpactError priceImpactQuery={priceImpactQuery} />}
          {simulationQuery.isError && (
            <GenericError
              customErrorName={'Error in query simulation'}
              error={simulationQuery.error}
            ></GenericError>
          )}
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
        onClose={previewModalDisclosure.onClose}
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
    </Box>
  )
}
