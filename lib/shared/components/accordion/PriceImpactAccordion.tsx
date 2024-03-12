import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  HStack,
  Text,
  VStack,
  Button,
  Card,
  useDisclosure,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { fNum } from '@/lib/shared/utils/numbers'
import { ReactNode, useEffect } from 'react'
import { PriceImpactAcceptModal } from '../modal/PriceImpactAcceptModal'

interface PriceImpactAccordionProps {
  setNeedsToAcceptHighPI: (value: boolean) => void
  accordionButtonComponent: ReactNode
  accordionPanelComponent: ReactNode
}
export function PriceImpactAccordion({
  setNeedsToAcceptHighPI,
  accordionButtonComponent,
  accordionPanelComponent,
}: PriceImpactAccordionProps) {
  const acceptHighImpactDisclosure = useDisclosure()
  const {
    priceImpactLevel,
    priceImpactColor,
    acceptHighPriceImpact,
    hasToAcceptHighPriceImpact,
    setAcceptHighPriceImpact,
    getPriceImpactIcon,
    priceImpact,
  } = usePriceImpact()

  useEffect(() => {
    if (hasToAcceptHighPriceImpact && !acceptHighPriceImpact) {
      setNeedsToAcceptHighPI(true)
    } else {
      setNeedsToAcceptHighPI(false)
    }
  }, [acceptHighPriceImpact, hasToAcceptHighPriceImpact])

  const handleClick = () => {
    if (priceImpactLevel === 'high' || priceImpactLevel === 'unknown') {
      setAcceptHighPriceImpact(true)
    } else {
      acceptHighImpactDisclosure.onOpen()
    }
  }

  return (
    <>
      <Accordion w="full" variant="button" allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {accordionButtonComponent}
              </Box>
              <HStack>
                <Box color={priceImpactColor}>{getPriceImpactIcon(priceImpactLevel)}</Box>
                <Text color={priceImpactColor} fontSize="sm">
                  Details
                </Text>
                <ChevronDownIcon color={priceImpactColor} fontWeight="bold" fontSize="xl" />
              </HStack>
            </AccordionButton>
          </h2>
          <AccordionPanel pb="md">{accordionPanelComponent}</AccordionPanel>
        </AccordionItem>
      </Accordion>
      {(priceImpactLevel === 'high' ||
        priceImpactLevel === 'max' ||
        priceImpactLevel === 'unknown') && (
        // TODO: fix a lot of styling here
        <>
          <VStack align="start" w="full">
            <Card w="full" p="2" border="2px solid" borderColor="red.500">
              <HStack w="full">
                <Box color={priceImpactColor} alignSelf="flex-start">
                  {getPriceImpactIcon(priceImpactLevel)}
                </Box>
                <VStack align="start">
                  {priceImpactLevel === 'unknown' ? (
                    <>
                      <Text color="white" fontWeight="700">
                        Price impact is unknown
                      </Text>
                      <Text color="white" fontSize="sm">
                        The price impact cannot be calculated. Only proceed if you know exactly what
                        you are doing.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text color="white" fontWeight="700">
                        Price impact is high: Exceeds {priceImpactLevel === 'high' ? '1' : '5'}.00%
                      </Text>
                      <Text color="white" fontSize="sm">
                        The higher the price impact, the worse exchange rate you get for this swap.
                      </Text>
                    </>
                  )}
                </VStack>
              </HStack>
            </Card>
            <Card w="full" p="2" variant="level1">
              <VStack w="full" align="flex-start">
                <Text>Price impact acknowledgement</Text>
                {priceImpactLevel === 'unknown' ? (
                  <Text color="grayText">
                    I accept that the price impact of this transaction is unknown. I understand that
                    proceeding may result in losses if my transaction moves the market price
                    unfavorably based on the current depth of the market.
                  </Text>
                ) : (
                  <Text color="grayText">
                    I accept the high price impact of{' '}
                    {priceImpact && fNum('priceImpact', priceImpact)}. I understand that this may
                    result in losses, since the size of my swap is likely to move the market price
                    unfavorably based on the current depth of the market.
                  </Text>
                )}
                {!acceptHighPriceImpact ? (
                  <Button w="full" variant="secondary" onClick={handleClick}>
                    I accept {priceImpactLevel === 'unknown' ? 'unknown' : 'high'} price impact
                  </Button>
                ) : (
                  <Text
                    w="full"
                    color="green.400"
                    bgColor="#25e2a41a" // green.400 with 10% opacity
                    p="2"
                    rounded="md"
                    align="center"
                  >
                    {priceImpactLevel === 'unknown' ? 'Unknown' : 'High'} price impact accepted
                  </Text>
                )}
              </VStack>
            </Card>
          </VStack>
          <PriceImpactAcceptModal
            isOpen={acceptHighImpactDisclosure.isOpen}
            onOpen={acceptHighImpactDisclosure.onOpen}
            onClose={acceptHighImpactDisclosure.onClose}
            setAcceptHighPriceImpact={setAcceptHighPriceImpact}
          />
        </>
      )}
    </>
  )
}
