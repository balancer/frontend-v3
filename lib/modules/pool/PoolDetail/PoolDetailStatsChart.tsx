'use client'

import { Grid, GridItem, Skeleton } from '@chakra-ui/react'
import { PoolChart } from './PoolChart/PoolChart'
import PoolStats from './PoolStatsNew'
import PoolMetaBadges from './PoolMetaBadges/PoolMetaBadges'

export function PoolDetailStatsChart({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Grid
      h="full"
      w="full"
      rowGap="md"
      columnGap="md"
      templateColumns={{ base: '1fr', lg: 'repeat(4,1fr)' }}
      templateAreas={{
        base: `"meta-badges"
                 "stats"
                 "chart"`,
        lg: `"meta-badges meta-badges meta-badges meta-badges"
               "stats chart chart chart"`,
      }}
    >
      <GridItem area="meta-badges">
        <PoolMetaBadges />
      </GridItem>
      <GridItem area="stats">
        <PoolStats />
      </GridItem>
      <GridItem area="chart">
        {isLoading ? <Skeleton h="385px" w="full" /> : <PoolChart />}
      </GridItem>
    </Grid>
  )
}
