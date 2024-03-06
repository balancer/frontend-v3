import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { HStack, VStack, Text, Tooltip } from '@chakra-ui/react'
import { useSwap } from './useSwap'
import { GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { useUserSettings } from '../user/settings/useUserSettings'

export function SwapDetails() {
  const { toCurrency } = useCurrency()
  const { slippage, slippageDecimal } = useUserSettings()
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
    <VStack spacing="sm" align="start" w="full" fontSize="sm">
      <HStack justify="space-between" w="full">
        <Text color="grayText">Price impact</Text>
        <HStack>
          <NumberText color="grayText">
            -{toCurrency(priceImpacUsd, { abbreviated: false })} (-{priceImpactLabel})
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
            -{toCurrency(maxSlippageUsd, { abbreviated: false })} (-{fNum('slippage', slippage)})
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
  )
}
