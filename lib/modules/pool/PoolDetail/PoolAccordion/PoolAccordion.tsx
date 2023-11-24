'use client'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react'

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
          <Heading variant="accordionHeading">Accordion Content</Heading>
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
