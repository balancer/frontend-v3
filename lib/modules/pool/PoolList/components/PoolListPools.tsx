import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './PoolListFilters'
import { PoolListSortType } from './PoolListSortType'
import { PoolListViewType } from './PoolListViewType'
import { PoolListCards } from './PoolListCards/PoolListCards'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolListViewType } from './usePoolListViewType'

export function PoolListPools() {
  const { viewType } = usePoolListViewType()

  return (
    <VStack align="start" spacing="md" w="full">
      <Heading as="h2" size="lg">
        Pools
      </Heading>
      <Stack direction={['column-reverse', 'row']} w="full" alignItems="flex-start">
        <PoolListFilters />
        <HStack justifyContent="flex-end" w="full">
          {viewType === 'cards' && <PoolListSortType />}
          <PoolListViewType />
        </HStack>
      </Stack>
      {viewType === 'list' && <PoolListTable />}
      {viewType === 'cards' && <PoolListCards />}
    </VStack>
  )
}
