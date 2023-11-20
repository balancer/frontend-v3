'use client'
import { PoolChart } from '@/lib/modules/pool/PoolDetail/PoolChart/PoolChart'
import { HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolInfoTable } from '@/lib/modules/pool/PoolDetail/PoolInfoTable/PoolInfoTable'
import { PoolComposition } from '@/lib/modules/pool/PoolDetail/PoolComposition/PoolComposition'
import PoolStats from '@/lib/modules/pool/PoolDetail/PoolStats'
import PoolMyLiquidity from '@/lib/modules/pool/PoolDetail/PoolMyLiquidity'
import PoolIncentives from '@/lib/modules/pool/PoolDetail/PoolIncentives'

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
