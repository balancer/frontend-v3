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
import { PoolActivityChart } from '../PoolActivityChart/PoolActivityChart'

export function PoolAccordion() {
  return (
    <Accordion width="full" variant="gradient" allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box width="full">
            <Heading variant="accordionHeading">Pool details</Heading>
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
            <Heading variant="accordionHeading">Pool activity</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <PoolActivityChart />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
