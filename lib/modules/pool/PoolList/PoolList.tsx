'use client'

import { VStack } from '@chakra-ui/react'
import React from 'react'
import { PoolListFeaturedPools } from './components/PoolListFeaturedPools'
import { PoolListPools } from './components/PoolListPools'
import { UserDataProvider } from '@/lib/shared/hooks/user/useUserData'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

export function PoolList() {
  const { address } = useUserAccount()

  const variables = { chains: PROJECT_CONFIG.supportedNetworks, address: address as `0x${string}` }

  return (
    <UserDataProvider variables={variables}>
      <VStack align="start" spacing="2xl">
        <PoolListFeaturedPools />
        <PoolListPools />
      </VStack>
    </UserDataProvider>
  )
}
