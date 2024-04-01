/* eslint-disable react-hooks/exhaustive-deps */
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
  AccordionIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  CardFooter,
  CardBody,
} from '@chakra-ui/react'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { fNum } from '@/lib/shared/utils/numbers'
import { ReactNode, useEffect } from 'react'
import { PriceImpactAcceptModal } from '../modals/PriceImpactAcceptModal'

interface PriceImpactAccordionProps {
  setNeedsToAcceptHighPI: (value: boolean) => void
  accordionButtonComponent: ReactNode
  accordionPanelComponent: ReactNode
  isDisabled?: boolean
}
export function PriceImpactAccordion({
  setNeedsToAcceptHighPI,
  accordionButtonComponent,
  accordionPanelComponent,
  isDisabled,
}: PriceImpactAccordionProps) {
  const acceptHighImpactDisclosure = useDisclosure()
  const {
    priceImpactLevel,
    priceImpactColor,
    acceptHighPriceImpact,
    hasToAcceptHighPriceImpact,
    setAcceptHighPriceImpact,
    PriceImpactIcon,
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
    <Box w="full">
      <Accordion w="full" variant="button" allowToggle>
        <AccordionItem w="full" isDisabled={isDisabled}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {accordionButtonComponent}
              </Box>
              <HStack>
                <PriceImpactIcon priceImpactLevel={priceImpactLevel} />
                <Text color={priceImpactColor} fontSize="sm">
                  Details
                </Text>
                <AccordionIcon textColor={priceImpactColor} />
              </HStack>
            </AccordionButton>
          </h2>
          <AccordionPanel py="md">{accordionPanelComponent}</AccordionPanel>
        </AccordionItem>
      </Accordion>
      {(priceImpactLevel === 'high' ||
        priceImpactLevel === 'max' ||
        priceImpactLevel === 'unknown') && (
        <>
          <VStack align="start" w="full" spacing="md" mt="md">
            <Alert status="error">
              <PriceImpactIcon priceImpactLevel={priceImpactLevel} size={24} mt="1" />
              <Box ml="md">
                <AlertTitle>
                  {priceImpactLevel === 'unknown'
                    ? 'Unknown price impact'
                    : `Price impact is high: Exceeds ${
                        priceImpactLevel === 'high' ? '1' : '5'
                      }.00%`}
                </AlertTitle>
                <AlertDescription>
                  <Text color="font.maxContrast">
                    {priceImpactLevel === 'unknown'
                      ? 'The price impact cannot be calculated. Only proceed if you know exactly what you are doing.'
                      : 'The higher the price impact, the worse exchange rate you get for this swap.'}
                  </Text>
                </AlertDescription>
              </Box>
            </Alert>
            <Card variant="subSection">
              <CardBody>
                <Text mb="sm" fontWeight="bold">
                  Price impact acknowledgement
                </Text>
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
              </CardBody>
              <CardFooter pt="md">
                {!acceptHighPriceImpact ? (
                  <Button w="full" variant="secondary" onClick={handleClick}>
                    I accept {priceImpactLevel === 'unknown' ? 'unknown' : 'high'} price impact
                  </Button>
                ) : (
                  <Button w="full" variant="secondary" isDisabled>
                    {priceImpactLevel === 'unknown' ? 'Unknown' : 'High'} price impact accepted
                  </Button>
                )}
              </CardFooter>
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
    </Box>
  )
}
