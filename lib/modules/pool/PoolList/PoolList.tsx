'use client'

import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { PoolListGrid } from './components/PoolListGrid/PoolListGrid'
import { PoolListViewType } from './components/PoolListViewType'
import { usePoolListViewType } from './components/usePoolListViewType'
import React from 'react'
import { PoolListSortType } from './components/PoolListSortType'
import { useBreakpoints } from '@/lib/hooks/useBreakpoints'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()
  const { viewType } = usePoolListViewType()
  const { isMobile } = useBreakpoints()

  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="md">
      <Stack direction={['column-reverse', 'row']} w="full" alignItems="flex-start">
        <PoolListFilters />
        <HStack justifyContent={isMobile ? 'space-between' : 'flex-end'} w="full">
          {(viewType === 'grid' || isMobile) && <PoolListSortType />}
          <PoolListViewType />
        </HStack>
      </Stack>
      {viewType === 'list' && <PoolListTable />}
      {viewType === 'grid' && <PoolListGrid />}
    </VStack>
  )
}
