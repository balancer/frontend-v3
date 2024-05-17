'use client'

import { Grid, GridItem, Skeleton, Stack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolCompositionNew'
// import PoolMyLiquidity from './PoolMyLiquidity'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolDetailStatsChart } from './PoolDetailStatsChart'
import { PoolDetailAttributesRisksContracts } from './PoolDetailAttributesRisksContracts'
import { usePool } from '../usePool'
import PoolMyLiquidity from './PoolMyLiquidity'
import { useEffect, useState } from 'react'

export function PoolDetail({ isLoading = false }: { isLoading?: boolean }) {
  const { isLoading: isLoadingPool, pool } = usePool()
  const [showMyLiquidity, setShowMyLiquidity] = useState(false)

  useEffect(() => {
    if (!isLoadingPool && pool.userBalance?.totalBalance !== '0') {
      setShowMyLiquidity(true)
    }
  }, [isLoadingPool])

  return (
    <Stack w="full">
      <Grid
        w="full"
        rowGap={{ base: 'md', md: '2xl' }}
        templateColumns="1fr"
        templateAreas={`"stats-chart"
               "activity"
               "composition"
               ${showMyLiquidity ? '"my-liquidity"' : ''}
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
        {showMyLiquidity && (
          <GridItem area="my-liquidity">
            <PoolMyLiquidity />
          </GridItem>
        )}
        <GridItem area="attributes-risks-contracts">
          <PoolDetailAttributesRisksContracts isLoading={isLoading} />
        </GridItem>
      </Grid>
    </Stack>
  )
}
