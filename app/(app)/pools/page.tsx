'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'

export const dynamic = 'force-dynamic'

export default function Home() {
  usePoolListSeedCacheQuery()

  return (
    <PoolListProvider>
      <Box p="md" maxW="maxContent" mx="auto" mt="xl">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
