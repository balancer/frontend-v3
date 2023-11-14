'use client'

import { VStack } from '@chakra-ui/react'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import React from 'react'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { PoolListFeaturedPools } from './components/PoolListFeaturedPools'
import { PoolListPools } from './components/PoolListPools'

export function PoolList() {
  const { address } = useUserAccount()
  const { tokens } = useTokens()

  useTokenBalances(address, tokens)

  return (
    <VStack align="start" spacing="2xl">
      <PoolListFeaturedPools />
      <PoolListPools />
    </VStack>
  )
}
