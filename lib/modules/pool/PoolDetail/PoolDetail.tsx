'use client'
import { usePool } from '@/lib/modules/pool/usePool'
import { PoolChart } from './PoolChart/PoolChart'
import { Stack, Text } from '@chakra-ui/react'
import { PoolInfoTable } from './PoolInfoTable/PoolInfoTable'
import { PoolStatCards } from './PoolStatCards/PoolStatCards'
import { PoolComposition } from './PoolComposition/PoolComposition'

export function PoolDetail() {
  const { pool } = usePool()

  return (
    <Stack maxW="maxContent">
      <Text>
        {pool.name}: {pool.id}
      </Text>
      <PoolStatCards />
      <PoolChart />
      <PoolComposition />
      <PoolInfoTable />
    </Stack>
  )
}
