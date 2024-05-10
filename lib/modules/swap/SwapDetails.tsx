/* eslint-disable react-hooks/exhaustive-deps */
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { HStack, VStack, Text, Tooltip, Box } from '@chakra-ui/react'
import { useSwap } from './useSwap'
import { GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { useUserSettings } from '../user/settings/useUserSettings'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { SdkSimulateSwapResponse } from './swap.types'
import { DefaultSwapHandler } from './handlers/DefaultSwap.handler'
import { useTokens } from '../tokens/useTokens'
import { NativeWrapHandler } from './handlers/NativeWrap.handler'
import { useEffect } from 'react'
import { InfoIcon } from '@/lib/shared/components/icons/InfoIcon'

export function OrderRoute() {
  const { simulationQuery } = useSwap()

  const queryData = simulationQuery.data as SdkSimulateSwapResponse
  const orderRouteVersion = queryData ? queryData.vaultVersion : 2
  const hopCount = queryData ? queryData.routes[0].hops.length : 0

  return (
    <HStack justify="space-between" w="full">
      <Text color="grayText">Order route</Text>
      <HStack>
        <Text color="grayText">
          BV{orderRouteVersion}: {hopCount} hops
        </Text>
        <Tooltip label="Balancer vault version and number of hops" fontSize="sm">
          <InfoIcon />
        </Tooltip>
      </HStack>
    </HStack>
  )
}

export function SwapDetails() {
  const { toCurrency } = useCurrency()
  const { slippage, slippageDecimal } = useUserSettings()
  const { usdValueForToken } = useTokens()
  const { tokenInInfo, tokenOutInfo, swapType, tokenIn, tokenOut, handler, simulationQuery } =
    useSwap()

  const { priceImpactLevel, priceImpactColor, PriceImpactIcon, setPriceImpact, priceImpact } =
    usePriceImpact()

  const isDefaultSwap = handler instanceof DefaultSwapHandler
  const isNativeWrapOrUnwrap = handler instanceof NativeWrapHandler

  const _slippage = isNativeWrapOrUnwrap ? 0 : slippage
  const _slippageDecimal = isNativeWrapOrUnwrap ? 0 : slippageDecimal

  const returnAmountUsd =
    swapType === GqlSorSwapType.ExactIn
      ? usdValueForToken(tokenOutInfo, tokenOut.amount)
      : usdValueForToken(tokenInInfo, tokenIn.amount)

  const priceImpactLabel = priceImpact ? fNum('priceImpact', priceImpact) : '-'
  const priceImpacUsd = bn(priceImpact || 0).times(returnAmountUsd)
  const maxSlippageUsd = bn(_slippage).div(100).times(returnAmountUsd)

  const limitLabel =
    swapType === GqlSorSwapType.ExactIn ? "You'll get at least" : "You'll pay at most"
  const limitToken = swapType === GqlSorSwapType.ExactIn ? tokenOutInfo : tokenInInfo
  const limitValue =
    swapType === GqlSorSwapType.ExactIn
      ? bn(tokenOut.amount).minus(bn(tokenOut.amount).times(_slippageDecimal)).toString()
      : bn(tokenIn.amount).plus(bn(tokenIn.amount).times(_slippageDecimal)).toString()

  useEffect(() => {
    setPriceImpact(simulationQuery.data?.priceImpact?.priceImpact)
  }, [simulationQuery.data])

  return (
    <VStack spacing="sm" align="start" w="full" fontSize="sm">
      <HStack justify="space-between" w="full">
        <Text color={priceImpactColor}>Price impact</Text>
        <HStack>
          {priceImpactLevel === 'unknown' ? (
            <Text>Unknown</Text>
          ) : (
            <NumberText color={priceImpactColor}>
              -{toCurrency(priceImpacUsd, { abbreviated: false })} (-{priceImpactLabel})
            </NumberText>
          )}
          <Tooltip label="Price impact" fontSize="sm">
            {priceImpactLevel === 'low' ? (
              <InfoIcon />
            ) : (
              <Box>
                <PriceImpactIcon priceImpactLevel={priceImpactLevel} />
              </Box>
            )}
          </Tooltip>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">Max slippage</Text>
        <HStack>
          <NumberText color="grayText">
            -{toCurrency(maxSlippageUsd, { abbreviated: false })} (-{fNum('slippage', _slippage)})
          </NumberText>
          <Tooltip label="Max slippage" fontSize="sm">
            <InfoIcon />
          </Tooltip>
        </HStack>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text color="grayText">{limitLabel}</Text>
        <HStack>
          <NumberText color="grayText">
            {fNum('token', limitValue, { abbreviated: false })} {limitToken?.symbol}
          </NumberText>
          <Tooltip label="This is the result if maximum slippage occurs." fontSize="sm">
            <InfoIcon />
          </Tooltip>
        </HStack>
      </HStack>

      {isDefaultSwap && <OrderRoute />}
    </VStack>
  )
}
