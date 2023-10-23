'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'
import { NextSearchParams } from '@/lib/global/global.types'

export const dynamic = 'force-dynamic'

export default function Pools({ searchParams }: { searchParams: NextSearchParams }) {
  usePoolListSeedCacheQuery(searchParams)

  return (
    <PoolListProvider>
      <Box p="md">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
