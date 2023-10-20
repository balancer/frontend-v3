'use client'

import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { PoolListGrid } from './components/PoolListGrid/PoolListGrid'
import { PoolListViewType } from './components/PoolListViewType'
import { usePoolListViewType } from './components/usePoolListViewType'
import React from 'react'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()
  const { viewType } = usePoolListViewType()

  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="md">
      <HStack justifyContent="space-between" w="full">
        <PoolListFilters />
        <PoolListViewType />
      </HStack>
      {viewType === 'list' && <PoolListTable />}
      {viewType === 'grid' && <PoolListGrid />}
    </VStack>
  )
}
