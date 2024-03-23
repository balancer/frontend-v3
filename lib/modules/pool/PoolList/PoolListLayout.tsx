'use client'

import { Heading, Stack, HStack, VStack, useToast } from '@chakra-ui/react'
import { FilterTags, PoolListFilters } from './PoolListFilters'
import { PoolListSortType } from './PoolListSortType'
import { PoolListViewType } from './PoolListViewType/PoolListViewType'
import { PoolListCards } from './PoolListCards/PoolListCards'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolListViewType } from './PoolListViewType/usePoolListViewType'
import { usePoolList } from './usePoolList'
import { fNum } from '@/lib/shared/utils/numbers'
import { useEffect } from 'react'
import { Toast } from '@/lib/shared/components/toasts/Toast'

export function PoolListLayout() {
  const { isTableView, isCardsView } = usePoolListViewType()
  const { pools, loading, count } = usePoolList()
  const toast = useToast()

  useEffect(() => {
    toast({
      duration: null,
      isClosable: true,
      status: 'success',
      title: 'Loading pools',
      description: 'Please wait...',
      render: ({ ...rest }) => <Toast {...rest} />,
    })
  }, [])

  return (
    <VStack align="start" spacing="md" w="full">
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        w="full"
        justify="space-between"
        align={{ base: 'start', lg: 'end' }}
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
          direction={{ base: 'column', md: 'row' }}
          w="full"
          align={{ base: 'end', md: 'center' }}
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
