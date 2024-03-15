import { HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolStats from './PoolStats'
import PoolMyLiquidity from './PoolMyLiquidity'
import PoolIncentives from './PoolIncentives'
import { PoolAccordion } from './PoolAccordion/PoolAccordion'
import PoolMetaBadges from './PoolMetaBadges/PoolMetaBadges'
import { PoolChart } from './PoolChart/PoolChart'
import { PoolAlerts } from '../alerts/PoolAlerts'

export async function PoolDetail() {
  return (
    <Stack width="full">
      <VStack width="full" spacing="16">
        <VStack alignItems="flex-start" width="full" spacing="5">
          <PoolMetaBadges />
          <PoolAlerts />
          <PoolStats />
          <HStack width="full" spacing="4">
            <PoolMyLiquidity />
            <PoolIncentives />
          </HStack>
          <HStack width="full" spacing="4">
            <PoolComposition />
          </HStack>
          <HStack width="full" spacing="4">
            <PoolChart />
          </HStack>
        </VStack>
        <PoolAccordion />
      </VStack>
    </Stack>
  )
}
