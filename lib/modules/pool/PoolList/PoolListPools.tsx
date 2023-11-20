import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { PoolListCards } from './PoolListCards/PoolListCards'
import { PoolListFilters } from './PoolListFilters'
import { PoolListSortType } from './PoolListSortType'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { PoolListViewType } from './PoolListViewType/PoolListViewType'
import { usePoolListViewType } from './PoolListViewType/usePoolListViewType'

export function PoolListPools() {
  const { isTableView, isCardsView } = usePoolListViewType()

  return (
    <VStack align="start" spacing="md" w="full">
      <Heading as="h2" size="lg">
        Pools
      </Heading>
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
