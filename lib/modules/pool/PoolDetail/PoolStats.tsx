import React from 'react'
import { Box, Card, HStack, Text, VStack } from '@chakra-ui/react'
import { useNumbers } from '@/lib/shared/hooks/useNumbers'
import { getAprLabel } from '../pool.utils'
import { usePool } from '../usePool'
import PoolBadges from './PoolBadges'

export default function PoolStats() {
  const { pool } = usePool()
  const { toCurrency } = useNumbers()

  return (
    <Card
      variant="gradient"
      width="full"
      height="320px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Box position="absolute" top="0.75rem" left="0.75rem">
        <PoolBadges />
      </Box>
      <HStack width="full" justifyContent="space-evenly">
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            TVL
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            {toCurrency(pool.dynamicData.totalLiquidity)}
          </Text>
        </VStack>
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            Volume (24h)
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            {toCurrency(pool.dynamicData.volume24h)}
          </Text>
        </VStack>
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            Revenue (24h)
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            {toCurrency(pool.dynamicData.fees24h)}
          </Text>
        </VStack>
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            APR
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            {getAprLabel(pool.dynamicData.apr.apr)}
          </Text>
        </VStack>
      </HStack>
    </Card>
  )
}
