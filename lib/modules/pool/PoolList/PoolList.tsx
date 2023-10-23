'use client'

import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { Box, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { NextSearchParams } from '@/lib/global/global.types'

export function PoolList({ searchParams }: { searchParams: NextSearchParams }) {
  console.log('search params', searchParams)
  usePoolListSeedCacheQuery(searchParams)

  const { address } = useAccount()
  const { tokens } = useTokens()

  useTokenBalances(address, tokens)

  return (
    <PoolListProvider>
      <Box p="md">
        <VStack align="start" spacing="md">
          <PoolListFilters />
          <PoolListTable />
        </VStack>
      </Box>
    </PoolListProvider>
  )
}
