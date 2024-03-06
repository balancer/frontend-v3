'use client'

import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, GridItem, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import PoolBadges from './PoolBadges'
import { usePool } from '../usePool'
import { getAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import PoolWeightChart from './PoolWeightCharts/PoolWeightChart'
import { GqlPoolAprValue } from '@/lib/shared/services/api/generated/graphql'
import Noise from '@/app/noise'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { ZenCircle } from '@/lib/shared/components/zen/ZenCircle'
import { ZenSquare } from '@/lib/shared/components/zen/ZenSquare'
import { ZenDiamond } from '@/lib/shared/components/zen/ZenDiamond'

interface PoolValues {
  totalLiquidity: string
  volume24h: string
  fees24h: string
  apr: GqlPoolAprValue
}

export default function PoolStats() {
  const { pool, chain } = usePool()
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
      variant="elevation1"
      width="full"
      height="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      shadow="2xl"
    >
      <Grid
        columnGap="4"
        rowGap="4"
        width="full"
        height="full"
        templateColumns="1fr 1fr 1fr 1fr"
        templateRows="1fr 1fr"
        p="4"
      >
        <GridItem position="relative" colSpan={2} rowSpan={2}>
          <NoisyCard
            contentProps={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box mt="-6">
              <PoolWeightChart pool={pool} chain={chain} />
            </Box>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            contentProps={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            cardProps={{ position: 'relative', overflow: 'hidden' }}
          >
            <ZenCircle sizePx="225px" />
            <VStack spacing="none" m="auto">
              <Heading fontSize="3xl">
                {poolValues ? (
                  toCurrency(poolValues.totalLiquidity)
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
              </Heading>
              <Text variant="secondaryGradient" fontWeight="semibold" fontSize="md">
                Pool value
              </Text>
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            contentProps={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            cardProps={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ZenDiamond widthPx="225px" heightPx="225px" />
            <VStack spacing="none" m="auto">
              <Heading fontSize="3xl">
                {poolValues ? (
                  toCurrency(poolValues.totalLiquidity)
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
              </Heading>
              <Text variant="secondaryGradient" fontWeight="semibold" fontSize="md">
                Pool value
              </Text>
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            contentProps={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            cardProps={{ position: 'relative', overflow: 'hidden' }}
          >
            <ZenSquare sizePx="225px" />
            <VStack spacing="none" m="auto">
              <Heading fontSize="3xl">
                {poolValues ? (
                  toCurrency(poolValues.volume24h)
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
              </Heading>
              <Text variant="secondaryGradient" fontWeight="semibold" fontSize="md">
                Swap volume (24h)
              </Text>
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            contentProps={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            cardProps={{ position: 'relative', overflow: 'hidden' }}
          >
            <ZenCircle sizePx="225px" />
            <VStack spacing="none" m="auto">
              <Heading fontSize="3xl">
                {pool.dynamicData ? (
                  pool.dynamicData.holdersCount
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
              </Heading>
              <Text variant="secondaryGradient" fontWeight="semibold" fontSize="md">
                Liquidity providers
              </Text>
            </VStack>
          </NoisyCard>
        </GridItem>
      </Grid>
    </Card>
  )
}
