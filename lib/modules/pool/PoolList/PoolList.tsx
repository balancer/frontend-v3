'use client'

import { PoolListPagination } from './components/PoolListPagination'
import { PoolListTable } from './components/PoolListTable/PoolListTable'
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
      <PoolListTable />
      <PoolListPagination />
    </VStack>
  )
}
