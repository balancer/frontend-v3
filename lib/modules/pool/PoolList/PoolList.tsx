'use client'

import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { Box, HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { PoolListCards } from './components/PoolListCards/PoolListCards'
import { PoolListViewType } from './components/PoolListViewType'
import { usePoolListViewType } from './components/usePoolListViewType'
import React from 'react'
import { PoolListSortType } from './components/PoolListSortType'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { useUserAccount } from '../../web3/useUserAccount'

export function PoolList() {
  const { address } = useUserAccount()
  const { tokens } = useTokens()
  const { viewType } = usePoolListViewType()
  const { isMobile } = useBreakpoints()

  useTokenBalances(address, tokens)

  return (
    <Box p="md">
      <VStack align="start" spacing="md">
        <Stack direction={['column-reverse', 'row']} w="full" alignItems="flex-start">
          <PoolListFilters />
          <HStack justifyContent={isMobile ? 'space-between' : 'flex-end'} w="full">
            {(viewType === 'cards' || isMobile) && <PoolListSortType />}
            <PoolListViewType />
          </HStack>
        </Stack>
        {viewType === 'list' && <PoolListTable />}
        {viewType === 'cards' && <PoolListCards />}
      </VStack>
    </Box>
  )
}
