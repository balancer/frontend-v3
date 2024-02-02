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

export function SwapDetailsAccordian() {
  const { simulationQuery } = useSwap()
  const { toCurrency } = useCurrency()
  const { slippage } = useUserSettings()

  const priceImpact = simulationQuery.data?.priceImpact
  const priceImpactLabel = priceImpact !== undefined ? fNum('priceImpact', priceImpact) : '-'

  return (
    <Accordion w="full" allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Spot price
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
                  {toCurrency(0, { abbreviated: false })} ({priceImpactLabel})
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
                  {toCurrency(0, { abbreviated: false })} ({fNum('slippage', slippage)})
                </NumberText>
                <Tooltip label="Price impact" fontSize="sm">
                  <InfoOutlineIcon color="GrayText" />
                </Tooltip>
              </HStack>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text color="GrayText">Gas cost</Text>
              <HStack>
                <NumberText color="GrayText">~{toCurrency(0, { abbreviated: false })}</NumberText>
                <Tooltip label="Price impact" fontSize="sm">
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
