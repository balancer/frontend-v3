'use client'
import { Grid, HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolStats from './PoolStats'
import PoolMyLiquidity from './PoolMyLiquidity'
import PoolIncentives from './PoolIncentives'
import { PoolAccordion } from './PoolAccordion/PoolAccordion'
import PoolMetaBadges from './PoolMetaBadges/PoolMetaBadges'

export function PoolDetail() {
  return (
    <Stack width="full">
      {/* {loading && <Text>Loading...</Text>} */}
      <VStack width="full" spacing="16">
        <VStack alignItems="flex-start" width="full" spacing="5">
          <PoolMetaBadges />
          <PoolStats />
          <Grid
            alignItems="flex-start"
            width="full"
            gridTemplateColumns="1fr 1fr"
            gridColumnGap="4"
          >
            <PoolMyLiquidity />
            <PoolIncentives />
          </Grid>
          <HStack width="full" spacing="4">
            <PoolComposition />
          </HStack>
        </VStack>
        <PoolAccordion />
      </VStack>
    </Stack>
  )
}
