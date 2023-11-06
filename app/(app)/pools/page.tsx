'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'

export default function Pools() {
  usePoolListSeedCacheQuery()
  return (
    <PoolListProvider>
      <Box p="md">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
