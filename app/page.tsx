'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'

export const dynamic = 'force-dynamic'

export default function Home() {
  usePoolListSeedCacheQuery()

  return (
    <PoolListProvider>
      <TokenBalancesProvider>
        <Box p="md">
          <PoolList />
        </Box>
      </TokenBalancesProvider>
    </PoolListProvider>
  )
}
