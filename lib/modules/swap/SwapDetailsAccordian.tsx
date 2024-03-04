import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  VStack,
  HStack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { ChevronDownIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import { useSwap } from './useSwap'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useUserSettings } from '../user/settings/useUserSettings'
import { useState } from 'react'
import { useTokens } from '../tokens/useTokens'
import { GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'

export function SwapDetailsAccordian() {
  const [priceDirection, setPriceDirection] = useState<'givenIn' | 'givenOut'>('givenIn')

  const {
    simulationQuery,
    tokenInInfo,
    tokenOutInfo,
    priceImpactLabel,
    priceImpacUsd,
    maxSlippageUsd,
    swapType,
    tokenIn,
    tokenOut,
  } = useSwap()
  const { toCurrency } = useCurrency()
  const { slippage, slippageDecimal } = useUserSettings()
  const { usdValueForToken } = useTokens()

  const effectivePrice = fNum('token', simulationQuery.data?.effectivePrice || '0', {
    abbreviated: false,
  })
  const effectivePriceReversed = fNum(
    'token',
    simulationQuery.data?.effectivePriceReversed || '0',
    { abbreviated: false }
  )

  const tokenInUsdValue = usdValueForToken(tokenInInfo, 1)
  const tokenOutUsdValue = usdValueForToken(tokenOutInfo, 1)

  const priceLabel =
    priceDirection === 'givenIn'
      ? `1 ${tokenInInfo?.symbol} = ${effectivePriceReversed} ${tokenOutInfo?.symbol} (${toCurrency(
          tokenInUsdValue,
          { abbreviated: false }
        )})`
      : `1 ${tokenOutInfo?.symbol} = ${effectivePrice} ${tokenInInfo?.symbol} (${toCurrency(
          tokenOutUsdValue,
          { abbreviated: false }
        )})`

  const togglePriceDirection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPriceDirection(priceDirection === 'givenIn' ? 'givenOut' : 'givenIn')
  }

  const orderRouteVersion = simulationQuery.data?.vaultVersion || 2
  const hopCount = simulationQuery.data?.routes[0]?.hops?.length || 0

  const limitLabel =
    swapType === GqlSorSwapType.ExactIn ? "You'll get at least" : "You'll pay at most"
  const limitToken = swapType === GqlSorSwapType.ExactIn ? tokenOutInfo : tokenInInfo
  const limitValue =
    swapType === GqlSorSwapType.ExactIn
      ? bn(tokenOut.amount).minus(bn(tokenOut.amount).times(slippageDecimal)).toString()
      : bn(tokenIn.amount).plus(bn(tokenIn.amount).times(slippageDecimal)).toString()

  return (
    <Accordion w="full" variant="button" allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text variant="secondary" fontSize="sm" onClick={togglePriceDirection}>
                {priceLabel}
              </Text>
            </Box>
            <HStack color="green">
              <Text color="green.300" fontSize="sm">
                Details
              </Text>
              <ChevronDownIcon color="green.300" fontWeight="bold" fontSize="xl" />
            </HStack>
          </AccordionButton>
        </h2>
        <AccordionPanel pb="md">
          <VStack spacing="sm" align="start" w="full" fontSize="sm">
            <HStack justify="space-between" w="full">
              <Text color="grayText">Price impact</Text>
              <HStack>
                <NumberText color="grayText">
                  {toCurrency(priceImpacUsd, { abbreviated: false })} ({priceImpactLabel})
                </NumberText>
                <Tooltip label="Price impact" fontSize="sm">
                  <InfoOutlineIcon color="grayText" />
                </Tooltip>
              </HStack>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text color="grayText">Max slippage</Text>
              <HStack>
                <NumberText color="grayText">
                  {toCurrency(maxSlippageUsd, { abbreviated: false })} ({fNum('slippage', slippage)}
                  )
                </NumberText>
                <Tooltip label="Price impact" fontSize="sm">
                  <InfoOutlineIcon color="grayText" />
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
                  <InfoOutlineIcon color="grayText" />
                </Tooltip>
              </HStack>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text color="grayText">Order route</Text>
              <HStack>
                <Text color="grayText">
                  BV{orderRouteVersion}: {hopCount} hops
                </Text>
                <Tooltip label="Balancer vault version and number of hops" fontSize="sm">
                  <InfoOutlineIcon color="grayText" />
                </Tooltip>
              </HStack>
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
