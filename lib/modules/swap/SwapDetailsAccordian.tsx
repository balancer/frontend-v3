import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { fNum } from '@/lib/shared/utils/numbers'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack,
  HStack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { useSwap } from './useSwap'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useUserSettings } from '../user/settings/useUserSettings'
import { useState } from 'react'

export function SwapDetailsAccordian() {
  const [priceDirection, setPriceDirection] = useState<'givenIn' | 'givenOut'>('givenIn')

  const {
    simulationQuery,
    tokenInInfo,
    tokenOutInfo,
    priceImpactLabel,
    priceImpacUsd,
    maxSlippageUsd,
  } = useSwap()
  const { toCurrency } = useCurrency()
  const { slippage } = useUserSettings()

  const effectivePrice = fNum('token', simulationQuery.data?.effectivePrice || '0', {
    abbreviated: false,
  })
  const effectivePriceReversed = fNum(
    'token',
    simulationQuery.data?.effectivePriceReversed || '0',
    { abbreviated: false }
  )

  const priceLabel =
    priceDirection === 'givenIn'
      ? `1 ${tokenInInfo?.symbol} = ${effectivePriceReversed} ${tokenOutInfo?.symbol}`
      : `1 ${tokenOutInfo?.symbol} = ${effectivePrice} ${tokenInInfo?.symbol}`

  const togglePriceDirection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setPriceDirection(priceDirection === 'givenIn' ? 'givenOut' : 'givenIn')
  }

  const orderRouteVersion = simulationQuery.data?.vaultVersion || 2
  const hopCount = simulationQuery.data?.routes[0]?.hops?.length || 0

  return (
    <Accordion w="full" allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text variant="secondary" fontSize="sm" onClick={togglePriceDirection}>
                {priceLabel}
              </Text>
            </Box>
            <HStack>
              <Text fontSize="sm">Details</Text>
              <AccordionIcon />
            </HStack>
          </AccordionButton>
        </h2>
        <AccordionPanel pb="md">
          <VStack spacing="sm" align="start" w="full">
            <HStack justify="space-between" w="full">
              <Text color="GrayText">Price impact</Text>
              <HStack>
                <NumberText color="GrayText">
                  {toCurrency(priceImpacUsd, { abbreviated: false })} ({priceImpactLabel})
                </NumberText>
                <Tooltip label="Price impact" fontSize="sm">
                  <InfoOutlineIcon color="GrayText" />
                </Tooltip>
              </HStack>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text color="GrayText">Max. slippage</Text>
              <HStack>
                <NumberText color="GrayText">
                  {toCurrency(maxSlippageUsd, { abbreviated: false })} ({fNum('slippage', slippage)}
                  )
                </NumberText>
                <Tooltip label="Price impact" fontSize="sm">
                  <InfoOutlineIcon color="GrayText" />
                </Tooltip>
              </HStack>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text color="GrayText">Order route</Text>
              <HStack>
                <NumberText color="GrayText">
                  BV{orderRouteVersion}: {hopCount} hops
                </NumberText>
                <Tooltip label="Balancer vault version and number of hops" fontSize="sm">
                  <InfoOutlineIcon color="GrayText" />
                </Tooltip>
              </HStack>
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
