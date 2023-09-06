'use client'
import { PoolListProvider, usePoolListSeedCacheQuery } from '@/lib/modules/pools/hooks/usePoolList'
import { PoolList } from '@/lib/modules/pools/components/PoolList/PoolList'
import { Box } from '@chakra-ui/react'

export const dynamic = 'force-dynamic'

export default function Home() {
  usePoolListSeedCacheQuery()

  return (
    <PoolListProvider>
      <Box p="md">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
