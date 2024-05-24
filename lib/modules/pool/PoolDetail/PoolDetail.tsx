'use client'

import { Grid, GridItem } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolDetailStatsChart } from './PoolDetailStatsChart'
import { PoolDetailAttributesRisksContracts } from './PoolDetailAttributesRisksContracts'
import { usePool } from '../PoolProvider'
import PoolMyLiquidity from './PoolMyLiquidity'
import { bn } from '@/lib/shared/utils/numbers'
import { MutableRefObject, createContext, useRef } from 'react'

// context is used to scroll to the My liquidity section
export type MyLiquidityRefContextType = {
  ref: MutableRefObject<HTMLDivElement | null>
}

export const MyLiquidityRefContext = createContext<MyLiquidityRefContextType | null>(null)

export function PoolDetail() {
  const { pool } = usePool()
  const ref = useRef<HTMLDivElement | null>(null)

  const userHasLiquidity = bn(pool.userBalance?.totalBalance || '0').gt(0)

  return (
    <MyLiquidityRefContext.Provider value={{ ref }}>
      <Grid
        w="full"
        rowGap={{ base: 'md', md: '2xl' }}
        templateColumns="1fr"
        templateAreas={`"stats-chart"
                      "activity"
                      "composition"
                      ${userHasLiquidity ? '"my-liquidity"' : ''}
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
        {userHasLiquidity && (
          <GridItem area="my-liquidity">
            <PoolMyLiquidity />
          </GridItem>
        )}
        <GridItem area="attributes-risks-contracts">
          <PoolDetailAttributesRisksContracts />
        </GridItem>
      </Grid>
    </MyLiquidityRefContext.Provider>
  )
}
