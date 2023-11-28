import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './PoolListFilters'
import { PoolListSortType } from './PoolListSortType'
import { PoolListViewType } from './PoolListViewType/PoolListViewType'
import { PoolListCards } from './PoolListCards/PoolListCards'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolListViewType } from './PoolListViewType/usePoolListViewType'
import { usePoolList } from './usePoolList'
import { integerFormat } from '@/lib/shared/hooks/useNumbers'

export function PoolListPools() {
  const { isTableView, isCardsView } = usePoolListViewType()
  const { count } = usePoolList()

  return (
    <VStack align="start" spacing="md" w="full">
      <HStack>
        <Heading as="h2" size="lg" variant="special">
          Liquidity pools
        </Heading>
        <Heading size="lg" opacity=".5">
          ({integerFormat(count || 0)})
        </Heading>
      </HStack>

      <Stack direction={['column-reverse', 'row']} w="full" alignItems="flex-start">
        <PoolListFilters />
        <HStack justifyContent="flex-end" w="full">
          {isCardsView && <PoolListSortType />}
          <PoolListViewType />
        </HStack>
      </Stack>
      {isTableView && <PoolListTable />}
      {isCardsView && <PoolListCards />}
    </VStack>
  )
}
