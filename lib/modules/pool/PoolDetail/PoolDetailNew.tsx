'use client'

import { Grid, GridItem, Skeleton, Stack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolCompositionNew'
// import PoolMyLiquidity from './PoolMyLiquidity'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolDetailStatsChart } from './PoolDetailStatsChart'
import { PoolDetailAttributesRisksContracts } from './PoolDetailAttributesRisksContracts'

export function PoolDetail({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Stack w="full">
      <Grid
        w="full"
        rowGap={{ base: 'md', md: '2xl' }}
        templateColumns="1fr"
        templateAreas={`"stats-chart"
                        "activity"
                        "composition"
                        "attributes-risks-contracts"`}
      >
        <GridItem area="stats-chart">
          <PoolDetailStatsChart isLoading={isLoading} />
        </GridItem>
        <GridItem area="activity">
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolActivityChart />}
        </GridItem>
        <GridItem area="composition">
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolComposition />}
        </GridItem>
        {/* <GridItem colSpan={2}>
          {isLoading ? <Skeleton h="370px" w="full" /> : <PoolMyLiquidity />}
        </GridItem> */}
        <GridItem area="attributes-risks-contracts">
          <PoolDetailAttributesRisksContracts isLoading={isLoading} />
        </GridItem>
      </Grid>
    </Stack>
  )
}