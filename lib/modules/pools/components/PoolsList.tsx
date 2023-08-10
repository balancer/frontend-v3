'use client'

import { Pagination } from './Pagination'
import { PoolsTable } from './PoolsTable.tsx/PoolsTable'
import { VStack } from '@chakra-ui/react'
import { usePools } from '../hooks/usePools'
import { useAccount } from 'wagmi'
import { useTokens } from '../../tokens/useTokens'
import { useTokenBalances } from '../../tokens/useTokenBalances'

export default function PoolsList() {
  const { pools, loading } = usePools()

  const { address } = useAccount()
  const { tokens } = useTokens()
  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="md">
      <PoolsTable pools={pools} loading={loading} />
      <Pagination />
    </VStack>
  )
}
