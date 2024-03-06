import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { SwapDetails } from './SwapDetails'
import { SwapRate } from './SwapRate'

export function SwapDetailsAccordian() {
  return (
    <Accordion w="full" variant="button" allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <SwapRate />
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
          <SwapDetails />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
