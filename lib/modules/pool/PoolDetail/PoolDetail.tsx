'use client'
import { HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolChart } from './PoolChart/PoolChart'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolIncentives from './PoolIncentives'
import { PoolInfoTable } from './PoolInfoTable/PoolInfoTable'
import PoolMyLiquidity from './PoolMyLiquidity'
import PoolStats from './PoolStats'

export function PoolDetail() {
  return (
    <Stack width="full" px="md" mx="auto">
      {/* {loading && <Text>Loading...</Text>} */}

      <VStack width="full" spacing="5">
        <PoolStats />
        <HStack width="full" spacing="4">
          <PoolMyLiquidity />
          <PoolIncentives />
        </HStack>
        <HStack width="full" spacing="4">
          <PoolComposition />
          <PoolChart />
        </HStack>
      </VStack>

      <PoolInfoTable />
    </Stack>
  )
}
