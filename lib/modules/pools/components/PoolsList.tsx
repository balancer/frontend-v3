'use client'

import { Pagination } from './Pagination'
import { PoolsTable } from './PoolsTable.tsx/PoolsTable'
import { VStack } from '@chakra-ui/react'
import { usePools } from '../hooks/usePools'

export default function PoolsList() {
  const { pools, loading } = usePools()

  console.log('pools', pools)

  return (
    <VStack align="start" spacing="md">
      <PoolsTable pools={pools} loading={loading} />
      <Pagination />
    </VStack>
  )
}
