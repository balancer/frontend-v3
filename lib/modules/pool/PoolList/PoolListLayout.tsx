'use client'

import { Box, Heading, Stack, HStack, VStack, useBreakpointValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FilterTags, PoolListFilters, useFilterTagsVisible } from './PoolListFilters'
import { PoolListTable } from './PoolListTable/PoolListTable'
import { usePoolList } from './PoolListProvider'
import { fNum } from '@/lib/shared/utils/numbers'

export function PoolListLayout() {
  const { pools, loading, count } = usePoolList()
  const isFilterVisible = useFilterTagsVisible()
  const isMd = useBreakpointValue({ base: false, md: true })

  const variants = {
    visible: {
      transform: isMd ? 'translateY(-40px)' : 'translateY(0)',
    },
    hidden: {
      transform: 'translateY(0)',
    },
  }

  return (
    <VStack align="start" spacing="md" w="full">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w="full"
        justify="space-between"
        align={isFilterVisible ? 'end' : 'start'}
      >
        <VStack align="start" w="full" pb={{ base: 'sm', md: '0' }}>
          <HStack w="full">
            <Box position="relative" top="0">
              <Box
                as={motion.div}
                position={{ base: 'relative', md: 'absolute' }}
                top="0"
                left="0"
                transition="all 0.15s var(--ease-out-cubic)"
                minW={{ base: 'auto', md: '270px' }}
                willChange="transform"
                variants={variants}
                animate={isFilterVisible ? 'visible' : 'hidden'}
              >
                <HStack w="full">
                  <Heading as="h2" size="lg" variant="special">
                    Liquidity pools
                  </Heading>
                  <Heading size="md" variant="secondary" mt="1">
                    ({fNum('integer', count || 0)})
                  </Heading>
                </HStack>
              </Box>
            </Box>
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
