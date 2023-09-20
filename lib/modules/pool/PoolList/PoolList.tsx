'use client'

import { PoolListPagination } from './components/PoolListPagination'
import { PoolListTable } from './components/PoolListTable/PoolListTable'
import { VStack } from '@chakra-ui/react'
import { PoolListFilters } from './components/PoolListFilters'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useVaultGetAuthorizer } from '@/lib/abi/generated'
import { useVaultContractAddress } from '@/lib/contracts/Vault'

export function PoolList() {
  const { address } = useAccount()
  const { tokens } = useTokens()
  const vaultContractAddress = useVaultContractAddress()
  const { data: authorizerAddress, isLoading: isLoadingAuthorizer } = useVaultGetAuthorizer({
    address: vaultContractAddress,
  })

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
