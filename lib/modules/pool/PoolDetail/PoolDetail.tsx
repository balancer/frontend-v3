'use client'
import { usePool } from '@/lib/modules/pool/usePool'
import { PoolChart } from './PoolChart/PoolChart'
import { Stack, Text } from '@chakra-ui/react'

export function PoolDetail() {
  const { pool, loading } = usePool()

  return (
    <Stack p="40px">
      {loading && <Text>Loading...</Text>}
      <Text>
        {pool?.name}: {pool?.id}
      </Text>
      <PoolChart />
    </Stack>
  )
}
