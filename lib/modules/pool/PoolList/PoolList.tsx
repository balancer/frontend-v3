'use client'

import { VStack } from '@chakra-ui/react'
import React from 'react'
import { PoolListFeaturedPools } from '@/lib/modules/pool/PoolList/PoolListFeaturedPools'
import { PoolListPools } from '@/lib/modules/pool/PoolList/PoolListPools'

export function PoolList() {
  return (
    <VStack align="start" spacing="2xl">
      <PoolListFeaturedPools />
      <PoolListPools />
    </VStack>
  )
}
