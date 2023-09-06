'use client'

import { PoolListPagination } from './components/PoolListPagination'
import { PoolsTable } from './components/PoolsTable.tsx/PoolListTable'
import { HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { PoolListSearch } from './components/PoolListSearch'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()
  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="md">
      <HStack>
        <PoolListFilters />
        <PoolListSearch />
      </HStack>

      <PoolsTable />
      <PoolListPagination />
    </VStack>
  )
}
