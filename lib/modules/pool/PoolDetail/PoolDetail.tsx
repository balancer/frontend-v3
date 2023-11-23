'use client'
import { HStack, Stack, VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import PoolStats from './PoolStats'
import PoolMyLiquidity from './PoolMyLiquidity'
import PoolIncentives from './PoolIncentives'

export function PoolDetail() {
  return (
    <Stack width="full" px="md" mx="auto">
      {/* {loading && <Text>Loading...</Text>} */}

      <VStack width="full" spacing="5">
        <PoolStats />
        <HStack width="full" spacing="4">
          <PoolMyLiquidity />
          <PoolIncentives />
        </HStack>
        <HStack width="full" spacing="4">
          <PoolComposition />
        </HStack>
      </VStack>
    </Stack>
  )
}
