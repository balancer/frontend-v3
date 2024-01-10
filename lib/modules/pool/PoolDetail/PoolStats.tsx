'use client'

import React, { useEffect, useState } from 'react'
import { Box, Card, Center, Grid, Heading, Skeleton, VStack } from '@chakra-ui/react'
import PoolBadges from './PoolBadges'
import { usePool } from '../usePool'
import { getAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import BoostedPoolWeightChart from './PoolWeightCharts/BoostedPoolWeightChart'
import PoolWeightChart from './PoolWeightCharts/PoolWeightChart'
import { GqlPoolAprValue } from '@/lib/shared/services/api/generated/graphql'

interface PoolValues {
  totalLiquidity: string
  volume24h: string
  fees24h: string
  apr: GqlPoolAprValue
}

export default function PoolStats() {
  const { pool } = usePool()
  const { toCurrency } = useCurrency()
  const [poolValues, setPoolValues] = useState<PoolValues | null>(null)

  useEffect(() => {
    if (pool) {
      setPoolValues({
        totalLiquidity: pool.dynamicData.totalLiquidity,
        volume24h: pool.dynamicData.volume24h,
        fees24h: pool.dynamicData.fees24h,
        apr: pool.dynamicData.apr.apr,
      })
    }
  }, [pool])

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
      <Grid templateColumns="repeat(5, 1fr)" columnGap="4" w="full">
        <Center>
          <VStack spacing="sm">
            <Heading size="h6" fontWeight="medium">
              TVL
            </Heading>
            <Heading fontSize="2xl">
              {poolValues ? (
                toCurrency(poolValues.totalLiquidity)
              ) : (
                <Skeleton height="25px" w="75px" />
              )}
            </Heading>
          </VStack>
        </Center>
        <Center>
          <VStack spacing="sm">
            <Heading size="h6" fontWeight="medium">
              Volume (24h)
            </Heading>
            <Heading fontSize="2xl">
              {poolValues ? toCurrency(poolValues.volume24h) : <Skeleton height="25px" w="75px" />}
            </Heading>
          </VStack>
        </Center>

        <PoolWeightChart />
        <Center>
          <VStack spacing="sm">
            <Heading size="h6" fontWeight="medium">
              Revenue (24h)
            </Heading>
            <Heading fontSize="2xl">
              {poolValues ? toCurrency(poolValues.fees24h) : <Skeleton height="25px" w="75px" />}
            </Heading>
          </VStack>
        </Center>
        <Center>
          <VStack spacing="sm">
            <Heading size="h6" fontWeight="medium">
              APR
            </Heading>
            <Heading fontSize="2xl">
              {poolValues ? getAprLabel(poolValues.apr) : <Skeleton height="25px" w="75px" />}
            </Heading>
          </VStack>
        </Center>
      </Grid>
    </Card>
  )
}
