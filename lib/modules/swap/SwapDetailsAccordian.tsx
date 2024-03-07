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
import { SwapDetails } from './SwapDetails'
import { SwapRate } from './SwapRate'
import { usePriceImpact } from '@/lib/shared/hooks/usePriceImpact'
import { fNum } from '@/lib/shared/utils/numbers'
import { useEffect } from 'react'
import { SwapDetailsAcceptPriceImpactModal } from './SwapDetailsAcceptPriceImpactModal'

interface SwapDetailsAccordianProps {
  priceImpact: string | undefined
  setIsNextBtnDisabled: (value: boolean) => void
}
export function SwapDetailsAccordian({
  priceImpact,
  setIsNextBtnDisabled,
}: SwapDetailsAccordianProps) {
  const acceptHighImpactDisclosure = useDisclosure()
  const {
    priceImpactLevel,
    priceImpactColor,
    acceptHighPriceImpact,
    hasToAcceptHighPriceImpact,
    setAcceptHighPriceImpact,
    getPriceImpactIcon,
    setPriceImpact,
  } = usePriceImpact()

  useEffect(() => {
    if (priceImpact) {
      setPriceImpact(priceImpact)
    }
  }, [priceImpact])

  useEffect(() => {
    if (hasToAcceptHighPriceImpact && !acceptHighPriceImpact) {
      setIsNextBtnDisabled(true)
    } else {
      setIsNextBtnDisabled(false)
    }
  }, [acceptHighPriceImpact, hasToAcceptHighPriceImpact])

  const handleClick = () => {
    if (priceImpactLevel === 'high') {
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
                <SwapRate />
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
          <AccordionPanel pb="md">
            <SwapDetails />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {(priceImpactLevel === 'high' || priceImpactLevel === 'max') && (
        // TODO: fix a lot of styling here
        <>
          <VStack align="start" w="full">
            <Card w="full" p="2" border="2px solid" borderColor="red.500">
              <HStack w="full">
                <Box color={priceImpactColor} alignSelf="flex-start">
                  {getPriceImpactIcon(priceImpactLevel)}
                </Box>
                <VStack align="start">
                  <Text color="white" fontWeight="700">
                    Price impact is high: Exceeds {priceImpactLevel === 'high' ? '1' : '5'}.00%.
                  </Text>
                  <Text color="white" fontSize="sm">
                    The higher the price impact, the worse exchange rate you get for this swap.
                  </Text>
                </VStack>
              </HStack>
            </Card>
            <Card w="full" p="2" variant="level1">
              <VStack w="full" align="flex-start">
                <Text>Price impact acknowledgement</Text>
                <Text color="grayText">
                  I accept the high price impact of{' '}
                  {priceImpact && fNum('priceImpact', priceImpact)}. I understand that this may
                  result in losses, since the size of my swap is likely to move the market price
                  unfavorably based on the current depth of the market.
                </Text>
                {!acceptHighPriceImpact ? (
                  <Button w="full" variant="secondary" onClick={handleClick}>
                    I accept high price impact
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
                    High price impact accepted
                  </Text>
                )}
              </VStack>
            </Card>
          </VStack>
          <SwapDetailsAcceptPriceImpactModal
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
