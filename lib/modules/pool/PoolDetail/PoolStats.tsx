import React from 'react'
import { Box, Card, HStack, Heading, VStack } from '@chakra-ui/react'
import PoolBadges from './PoolBadges'
import { usePool } from '../usePool'
import { getAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import TriWeightChart from './PoolWeightCharts/TriWeightChart'

export default function PoolStats() {
  const { pool } = usePool()
  const { toCurrency } = useCurrency()

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
        <VStack spacing="sm">
          <Heading size="h6" fontWeight="medium">
            TVL
          </Heading>
          <Heading fontSize="2xl">{toCurrency(pool.dynamicData.totalLiquidity)}</Heading>
        </VStack>
        <VStack spacing="sm">
          <Heading size="h6" fontWeight="medium">
            Volume (24h)
          </Heading>
          <Heading fontSize="2xl">{toCurrency(pool.dynamicData.volume24h)}</Heading>
        </VStack>
        <TriWeightChart />
        <VStack spacing="sm">
          <Heading size="h6" fontWeight="medium">
            Revenue (24h)
          </Heading>
          <Heading fontSize="2xl">{toCurrency(pool.dynamicData.fees24h)}</Heading>
        </VStack>
        <VStack spacing="sm">
          <Heading size="h6" fontWeight="medium">
            APR
          </Heading>
          <Heading fontSize="2xl">{getAprLabel(pool.dynamicData.apr.apr)}</Heading>
        </VStack>
      </HStack>
    </Card>
  )
}
