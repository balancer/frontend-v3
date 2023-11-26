'use client'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { PoolAttributes } from '../PoolInfoTable/PoolInfoTable'

export function PoolAccordion() {
  return (
    <Accordion width="full" variant="gradient" allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box width="full">
            <Heading variant="accordionHeading">Pool Activity</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <HStack width="full">
            <PoolAttributes />
            <VStack></VStack>
          </HStack>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box width="full">
            <Heading variant="accordionHeading">APR Calculator</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Heading variant="accordionHeading">Accordion Content</Heading>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box width="full">
            <Heading variant="accordionHeading">Pool Details</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Heading variant="accordionHeading">Accordion Content</Heading>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
