'use client'
export const dynamic = 'force-dynamic'

import PoolsList from '@/lib/modules/pools/components/PoolsList/PoolsList'
import { PoolsProvider, useSeedPoolsCacheQuery } from '@/lib/modules/pools/hooks/usePools'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { Box } from '@chakra-ui/react'

export default function Home() {
  useSeedPoolsCacheQuery()

  return (
    <PoolsProvider>
      <TokenBalancesProvider>
        <Box p="md">
          <PoolsList />
        </Box>
      </TokenBalancesProvider>
    </PoolsProvider>
  )
}
