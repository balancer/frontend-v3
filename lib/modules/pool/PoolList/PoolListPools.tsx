import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from '@/lib/modules/pool/PoolList/PoolListFilters'
import { PoolListSortType } from '@/lib/modules/pool/PoolList/PoolListSortType'
import { PoolListViewType } from '@/lib/modules/pool/PoolList/PoolListViewType/PoolListViewType'
import { PoolListCards } from '@/lib/modules/pool/PoolList/PoolListCards/PoolListCards'
import { PoolListTable } from '@/lib/modules/pool/PoolList/PoolListTable/PoolListTable'
import { usePoolListViewType } from '@/lib/modules/pool/PoolList/PoolListViewType/usePoolListViewType'

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
