'use client'
import { PoolListProvider, usePoolListSeedCacheQuery } from '@/lib/modules/pools/hooks/usePoolList'
import PoolsList from '@/lib/modules/pools/components/PoolsList/PoolsList'
import { Box } from '@chakra-ui/react'

export const dynamic = 'force-dynamic'

export default function Home() {
  usePoolListSeedCacheQuery()

  return (
    <PoolListProvider>
      <Box p="md">
        <PoolsList />
      </Box>
    </PoolListProvider>
  )
}
