'use client'

import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './PoolListFilters'
import { PoolListSortType } from './PoolListSortType'
import { PoolListViewType } from './PoolListViewType/PoolListViewType'
import { PoolListCards } from './PoolListCards/PoolListCards'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolListViewType } from './PoolListViewType/usePoolListViewType'
import { usePoolList } from './usePoolList'
import { fNum } from '@/lib/shared/utils/numbers'

export function PoolListLayout() {
  const { isTableView, isCardsView } = usePoolListViewType()
  const { pools, loading, count } = usePoolList()

  return (
    <VStack align="start" spacing="md" w="full">
      <HStack>
        <Heading as="h2" size="lg" variant="special">
          Liquidity pools
        </Heading>
        <Heading size="md" variant="secondary" mt="1">
          ({fNum('integer', count || 0)})
        </Heading>
      </HStack>
      <Stack direction={{ base: 'column-reverse', md: 'row' }} w="full" alignItems="flex-start">
        <PoolListFilters />
        <HStack justifyContent="flex-end" w="full">
          {isCardsView && <PoolListSortType />}
          <PoolListViewType />
        </HStack>
      </Stack>
      {isTableView && <PoolListTable pools={pools} count={count || 0} loading={loading} />}
      {isCardsView && <PoolListCards pools={pools} count={count || 0} loading={loading} />}
    </VStack>
  )
}
