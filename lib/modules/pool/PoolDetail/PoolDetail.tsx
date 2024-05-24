'use client'

import { Grid, GridItem, VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolDetailAttributesRisksContracts } from './PoolDetailAttributesRisksContracts'
import { usePool } from '../PoolProvider'
import PoolMyLiquidity from './PoolMyLiquidity'
import { bn } from '@/lib/shared/utils/numbers'
import { PoolStats } from './PoolStats/PoolStats'
import { PoolHeader } from './PoolHeader'

export function PoolDetail() {
  const { pool } = usePool()

  const userHasLiquidity = bn(pool.userBalance?.totalBalance || '0').gt(0)

  return (
    <>
      <VStack w="full" spacing="xl">
        <VStack w="full" spacing="xs">
          <PoolHeader />
          <PoolStats />
        </VStack>
      </VStack>
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
    </>
  )
}
