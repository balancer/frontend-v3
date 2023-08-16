'use client'

import { Pagination } from './Pagination'
import { PoolsTable } from './PoolsTable.tsx/PoolsTable'
import { VStack } from '@chakra-ui/react'
import { usePools } from '../../hooks/usePools'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { Filters } from './Filters'

export default function PoolsList() {
  const { pools, loading } = usePools()

  const { balances } = useTokenBalances()

  // Useful for testing until we actually use balances in the UI
  if (balances.length > 1) console.log({ balances })

  return (
    <VStack align="start" spacing="md">
      <Filters />
      <PoolsTable pools={pools} loading={loading} />
      <Pagination />
    </VStack>
  )
}
