'use client'

import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { PoolListPagination } from './components/PoolListPagination'
import { PoolListTable } from './components/PoolListTable/PoolListTable'

export function PoolList() {
  const { balances } = useTokenBalances()

  // Useful for testing until we actually use balances in the UI
  if (balances.length > 1) console.log({ balances })

  return (
    <VStack align="start" spacing="md">
      <PoolListFilters />
      <PoolListTable />
      <PoolListPagination />
    </VStack>
  )
}
