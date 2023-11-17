'use client'

import { VStack } from '@chakra-ui/react'
import React from 'react'
import { PoolListFeaturedPools } from './components/PoolListFeaturedPools'
import { PoolListPools } from './components/PoolListPools'

export function PoolList() {
  return (
    <VStack align="start" spacing="2xl">
      <PoolListFeaturedPools />
      <PoolListPools />
    </VStack>
  )
}
