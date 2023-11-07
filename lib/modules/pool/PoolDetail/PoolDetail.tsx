'use client'
import { usePool } from '@/lib/modules/pool/usePool'
import { PoolChart } from './PoolChart/PoolChart'
import { HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { PoolInfoTable } from './PoolInfoTable/PoolInfoTable'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolStats from './PoolStats/PoolStats'
import PoolMyLiquidity from './PoolMyLiquidity/PoolMyLiquidity'
import PoolIncentives from './PoolIncentives/PoolIncentives'

export function PoolDetail() {
  const { pool, loading } = usePool()

  return (
    <Stack width="full" px="md" mx="auto">
      {loading && <Text>Loading...</Text>}

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
