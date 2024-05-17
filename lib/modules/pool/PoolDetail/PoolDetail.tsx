'use client'

import { Grid, GridItem, Stack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolDetailStatsChart } from './PoolDetailStatsChart'
import { PoolDetailAttributesRisksContracts } from './PoolDetailAttributesRisksContracts'
import { usePool } from '../usePool'
import PoolMyLiquidity from './PoolMyLiquidity'
import { useEffect, useState } from 'react'

export function PoolDetail() {
  const { isLoading, pool } = usePool()
  const [showMyLiquidity, setShowMyLiquidity] = useState(false)

  useEffect(() => {
    if (!isLoading && pool.userBalance?.totalBalance !== '0') {
      setShowMyLiquidity(true)
    }
  }, [isLoading])

  return (
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
        <PoolDetailStatsChart />
      </GridItem>
      <GridItem area="activity">
        <PoolActivityChart />
      </GridItem>
      <GridItem area="composition">
        <PoolComposition />
      </GridItem>
      {showMyLiquidity && (
        <GridItem area="my-liquidity">
          <PoolMyLiquidity />
        </GridItem>
      )}
      <GridItem area="attributes-risks-contracts">
        <PoolDetailAttributesRisksContracts />
      </GridItem>
    </Grid>
  )
}
