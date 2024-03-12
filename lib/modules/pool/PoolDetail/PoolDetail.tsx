'use client'
import { Grid, GridItem, Stack, VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolStats from './PoolStats'
import PoolMyLiquidity from './PoolMyLiquidity'
import PoolIncentives from './PoolIncentives'
import PoolMetaBadges from './PoolMetaBadges/PoolMetaBadges'
import { PoolChart } from './PoolChart/PoolChart'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolAttributes } from './PoolAttributes/PoolAttributes'
import { PoolRisks } from './PoolRisks/PoolRisks'
import { PoolContracts } from './PoolContracts/PoolContracts'

export async function PoolDetail() {
  return (
    <Stack width="full">
      {/* {loading && <Text>Loading...</Text>} */}
      <Grid width="full" rowGap="10" columnGap="4" templateColumns="1fr 1fr">
        <GridItem colSpan={2}>
          <VStack alignItems="flex-start" spacing="5">
            <PoolMetaBadges />
            <PoolStats />
          </VStack>
        </GridItem>
        <GridItem colSpan={2}>
          <PoolMyLiquidity />
        </GridItem>
        <GridItem pt="10" colSpan={2}>
          <PoolIncentives />
        </GridItem>

        <GridItem pt="10" colSpan={1}>
          <PoolComposition />
        </GridItem>
        <GridItem pt="10" colSpan={1}>
          <PoolChart />
        </GridItem>
        <GridItem colSpan={2}>
          <PoolActivityChart />
        </GridItem>
        <GridItem colSpan={1}>
          <PoolAttributes />
        </GridItem>
        <GridItem colSpan={1}>
          <VStack spacing="4">
            <PoolRisks />
            <PoolContracts />
          </VStack>
        </GridItem>
        {/* <HStack width="full" spacing="4"></HStack> */}
        {/* <PoolAccordion /> */}
      </Grid>
    </Stack>
  )
}
