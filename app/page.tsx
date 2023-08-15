'use client'
export const dynamic = 'force-dynamic'

import PoolsList from '@/lib/modules/pools/components/PoolsList/PoolsList'
import { PoolsProvider, useSeedPoolsCacheQuery } from '@/lib/modules/pools/hooks/usePools'
import { Box } from '@chakra-ui/react'

export default function Home() {
  useSeedPoolsCacheQuery()

  return (
    <PoolsProvider>
      <Box p="md">
        <PoolsList />
      </Box>
    </PoolsProvider>
  )
}
