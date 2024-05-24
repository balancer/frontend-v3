'use client'

import { Grid, GridItem } from '@chakra-ui/react'
import { PoolCharts } from './PoolCharts/PoolCharts'
import { PoolSnapshot } from './PoolSnapshot/PoolSnapshot'

export function PoolStats() {
  return (
    <Grid
      h="full"
      w="full"
      rowGap="md"
      columnGap="md"
      templateColumns={{ base: '1fr', md: 'repeat(4,1fr)' }}
      templateAreas={{
        base: `"meta-badges"
               "stats"
               "chart"`,
        lg: `"meta-badges meta-badges meta-badges meta-badges"
             "stats chart chart chart"`,
      }}
    >
      <GridItem area="stats">
        <PoolSnapshot />
      </GridItem>
      <GridItem area="chart">
        <PoolCharts />
      </GridItem>
    </Grid>
  )
}
