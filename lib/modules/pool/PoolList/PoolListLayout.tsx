'use client'

import { Heading, Stack, HStack, VStack } from '@chakra-ui/react'
import { FilterTags, PoolListFilters } from './PoolListFilters'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolList } from './PoolListProvider'
import { fNum } from '@/lib/shared/utils/numbers'

export function PoolListLayout() {
  const { pools, loading, count } = usePoolList()

  return (
    <VStack align="start" spacing="md" w="full">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w="full"
        justify="space-between"
        align="start"
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

        <Stack direction="row" w="full" align={{ base: 'end', sm: 'center' }}>
          <PoolListFilters />
        </Stack>
      </Stack>
      <PoolListTable pools={pools} count={count || 0} loading={loading} />
    </VStack>
  )
}
