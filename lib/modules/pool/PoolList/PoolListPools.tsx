import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './PoolListFilters'
import { PoolListSortType } from './PoolListSortType'
import { PoolListViewType } from './PoolListViewType/PoolListViewType'
import { PoolListCards } from './PoolListCards/PoolListCards'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolListViewType } from './PoolListViewType/usePoolListViewType'
import { useUserData } from '@/lib/shared/hooks/user/useUserData'
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { DecoratedPoolListItem } from '../pool.types'

export function PoolListPools() {
  const { isTableView, isCardsView } = usePoolListViewType()
  const { pools, loading, count } = usePoolList()
  const { usdBalanceForPool } = useUserData()

  const decoratedPools: DecoratedPoolListItem[] = pools.map(pool => ({
    ...pool,
    myLiquidity: usdBalanceForPool(pool.id),
  }))

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
      {isTableView && <PoolListTable pools={decoratedPools} count={count || 0} loading={loading} />}
      {isCardsView && <PoolListCards pools={decoratedPools} count={count || 0} />}
    </VStack>
  )
}
