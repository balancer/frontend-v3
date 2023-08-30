'use client'
// export const dynamic = 'force-dynamic'

import PoolsList from '@/lib/modules/pools/components/PoolsList/PoolsList'
import { PoolsProvider } from '@/lib/modules/pools/hooks/usePools'
import { GetPoolsQuery } from '@/lib/services/api/generated/graphql'
import { Box } from '@chakra-ui/react'

interface Props {
  initPools: GetPoolsQuery
}

export default function PoolsPage({ initPools }: Props) {
  return (
    <PoolsProvider initPools={initPools}>
      <Box p="md">
        <PoolsList />
      </Box>
    </PoolsProvider>
  )
}
