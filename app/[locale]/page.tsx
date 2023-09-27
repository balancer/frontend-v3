'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Home() {
  const searchParams = useSearchParams()
  usePoolListSeedCacheQuery(searchParams)

  return (
    <PoolListProvider>
      <Box p="md">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
