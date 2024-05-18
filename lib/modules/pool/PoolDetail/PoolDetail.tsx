'use client'

import { Grid, GridItem, Skeleton, Stack, VStack } from '@chakra-ui/react'
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

export function PoolDetail({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Stack width="full">
      <Grid width="full" rowGap="xl" columnGap="md" templateColumns="1fr 1fr">
        <GridItem colSpan={2}>
          <VStack alignItems="flex-start" spacing="md">
            {isLoading ? <Skeleton h="42px" w="sm" /> : <PoolMetaBadges />}
            {isLoading ? <Skeleton h="400px" w="full" /> : <PoolStats />}
          </VStack>
        </GridItem>
        <GridItem colSpan={2}>
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolActivityChart />}
        </GridItem>
        <GridItem colSpan={2}>
          {isLoading ? <Skeleton h="370px" w="full" /> : <PoolMyLiquidity />}
        </GridItem>
        <GridItem colSpan={2}>
          {isLoading ? <Skeleton h="84px" w="full" /> : <PoolIncentives />}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolComposition />}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolChart />}
        </GridItem>
        <GridItem colSpan={{ base: 2, sm: 1 }}>
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolAttributes />}
        </GridItem>
        <GridItem colSpan={{ base: 2, sm: 1 }}>
          <VStack spacing="md" minH="full">
            {isLoading ? <Skeleton h="200px" w="full" /> : <PoolRisks />}
            {isLoading ? <Skeleton h="100px" w="full" /> : <PoolContracts />}
          </VStack>
        </GridItem>
      </Grid>
    </Stack>
  )
}
