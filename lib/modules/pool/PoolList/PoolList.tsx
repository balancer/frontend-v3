'use client'

import { VStack } from '@chakra-ui/react'
import React from 'react'
import { FeaturedPools } from '../../featuredPools/FeaturedPools'
import { PoolListPools } from './PoolListPools'

export function PoolList() {
  return (
    <VStack align="start" spacing="2xl">
      <FeaturedPools />
      <PoolListPools />
    </VStack>
  )
}
