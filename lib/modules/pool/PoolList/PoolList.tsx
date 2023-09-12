'use client'

import { PoolListPagination } from './components/PoolListPagination'
import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { Vault } from '@/lib/contracts/Vault'
import { useRef } from 'react'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()
  const vault = useRef(Vault.getContractInstance())
  const { isLoading: isLoadingAuthorizer, data: authorizerAddress } = vault.current.query(
    'getAuthorizer',
    []
  )

  console.log('example', {
    isLoadingAuthorizer,
    authorizerAddress,
  })

  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="md">
      <PoolListFilters />
      <PoolListTable />
      <PoolListPagination />
    </VStack>
  )
}
