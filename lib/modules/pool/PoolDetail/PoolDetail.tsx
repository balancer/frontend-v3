import { Grid, GridItem, HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolStats from './PoolStats'
import PoolMyLiquidity from './PoolMyLiquidity'
import PoolIncentives from './PoolIncentives'
import { PoolAccordion } from './PoolAccordion/PoolAccordion'
import PoolMetaBadges from './PoolMetaBadges/PoolMetaBadges'
import { PoolChart } from './PoolChart/PoolChart'

export async function PoolDetail() {
  return (
    <Stack width="full">
      {/* {loading && <Text>Loading...</Text>} */}
      <Grid width="full" rowGap="5" templateColumns="1fr 1fr">
        <GridItem colSpan={2}>
          <VStack alignItems="flex-start" spacing="5">
            <PoolMetaBadges />
            <PoolStats />
          </VStack>
        </GridItem>
        <GridItem colSpan={2}>
          <PoolMyLiquidity />
        </GridItem>
        <GridItem colSpan={2}>
          <PoolIncentives />
        </GridItem>
        <HStack width="full" spacing="4"></HStack>
        <HStack width="full" spacing="4">
          <PoolComposition />
        </HStack>
        <HStack width="full" spacing="4">
          <PoolChart />
        </HStack>
        <PoolAccordion />
      </Grid>
    </Stack>
  )
}
