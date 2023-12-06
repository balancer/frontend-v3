'use client'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  Heading,
} from '@chakra-ui/react'
import { PoolAttributes } from '../PoolAttributes/PoolAttributes'
import { PoolRisks } from '../PoolRisks/PoolRisks'
import { PoolContracts } from '../PoolContracts/PoolContracts'
import { PoolChart } from '../PoolChart/PoolChart'

export function PoolAccordion() {
  return (
    <Accordion width="full" variant="gradient" allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box width="full">
            <Heading variant="accordionHeading">Pool Details</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Grid templateColumns="1fr 1fr" rowGap="4" columnGap="4">
            <PoolAttributes />
            <Grid rowGap="4">
              <PoolRisks />
              <PoolContracts />
            </Grid>
          </Grid>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box width="full">
            <Heading variant="accordionHeading">Pool Activity</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <PoolChart />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
