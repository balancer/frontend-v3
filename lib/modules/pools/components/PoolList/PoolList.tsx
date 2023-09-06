'use client'

import { PoolListPagination } from './components/PoolListPagination'
import { PoolsTable } from './components/PoolsTable.tsx/PoolListTable'
import { VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()
  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="md">
      <PoolListFilters />
      <PoolsTable />
      <PoolListPagination />
    </VStack>
  )
}
