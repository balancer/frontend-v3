'use client'

import { Grid, GridItem, Skeleton, Stack } from '@chakra-ui/react'
import { PoolChart } from './PoolChart/PoolChart'

export function PoolDetailStatsChart({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Stack w="full">
      <Grid
        w="full"
        rowGap="xl"
        columnGap="md"
        templateColumns="repeat(4,1fr)"
        templateAreas={{
          base: `"stats"
                 "chart"`,
          lg: `"stats chart chart chart"`,
        }}
      >
        <GridItem area="stats">STATS</GridItem>
        <GridItem area="chart">
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolChart />}
        </GridItem>
      </Grid>
    </Stack>
  )
}
