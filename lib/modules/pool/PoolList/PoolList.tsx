'use client'

import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { Box, VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { PoolListProvider } from '@/lib/modules/pool/PoolList/usePoolList'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()

  useTokenBalances(address, tokens)

  return (
    <PoolListProvider>
      <Box p="md">
        <VStack align="start" spacing="md">
          <PoolListFilters />
          <PoolListTable />
        </VStack>
      </Box>
    </PoolListProvider>
  )
}
