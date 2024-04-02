'use client'

import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { FilterTags, PoolListFilters } from './PoolListFilters'
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
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w="full"
        justify="space-between"
        align={{ base: 'start', md: 'end' }}
      >
        <VStack align="start" w="full">
          <HStack w="full">
            <Heading as="h2" size="lg" variant="special">
              Liquidity pools
            </Heading>
            <Heading size="md" variant="secondary" mt="1">
              ({fNum('integer', count || 0)})
            </Heading>
          </HStack>
          <FilterTags />
        </VStack>

        <Stack
          direction={{ base: 'row', sm: 'row' }}
          w="full"
          align={{ base: 'end', sm: 'center' }}
        >
          <PoolListFilters />
          <HStack>
            {isCardsView && <PoolListSortType />}
            <PoolListViewType />
          </HStack>
        </Stack>
      </Stack>
      {isTableView && <PoolListTable pools={pools} count={count || 0} loading={loading} />}
      {isCardsView && <PoolListCards pools={pools} count={count || 0} loading={loading} />}
    </VStack>
  )
}
