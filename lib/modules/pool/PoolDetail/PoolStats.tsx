'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  BoxProps,
  Card,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { usePool } from '../usePool'
import { getAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import PoolWeightChart from './PoolWeightCharts/PoolWeightChart'
import { GqlPoolAprValue } from '@/lib/shared/services/api/generated/graphql'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { BarChart, Gift, Shield, Users } from 'react-feather'
import { ElevatedIcon } from '@/lib/shared/components/icons/ElevatedIcon'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { PoolZenGarden, ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import PoolBadges from './PoolBadges'

interface PoolValues {
  totalLiquidity: string
  volume24h: string
  fees24h: string
  apr: GqlPoolAprValue
}

const commonNoisyCardProps: { contentProps: BoxProps; cardProps: BoxProps } = {
  contentProps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardProps: {
    position: 'relative',
    overflow: 'hidden',
  },
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
      height={{ base: 'auto', md: '400px' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      p="md"
    >
      <Grid
        columnGap="4"
        rowGap="4"
        width="full"
        height="full"
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        templateRows={{ base: 'repeat(4, 1fr)', md: '1fr 1fr' }}
        p="0"
      >
        <GridItem position="relative" gridArea="1 / 1 / 3 / 3">
          <NoisyCard
            cardProps={{
              ...commonNoisyCardProps.cardProps,
              borderTopRightRadius: 'none',
              borderBottomRightRadius: 'none',
            }}
            contentProps={commonNoisyCardProps.contentProps}
          >
            <PoolZenGarden sizePx="400px" poolType={pool.type} />
            <VStack spacing="4">
              <Box mt="-6">
                <PoolWeightChart pool={pool} chain={chain} />
              </Box>
              <PoolBadges />
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            cardProps={{
              ...commonNoisyCardProps.cardProps,
              borderTopRightRadius: 'none',
              borderBottomRightRadius: 'none',
              borderBottomLeftRadius: 'none',
              borderTopLeftRadius: 'none',
            }}
            contentProps={commonNoisyCardProps.contentProps}
          >
            <ZenGarden variant="circle" sizePx="225px" />
            <VStack spacing="4" m="auto">
              <ElevatedIcon as={Shield} sizePx="48px" boxSize={5} />
              <VStack spacing="0">
                <Heading size="h4">
                  {poolValues ? (
                    toCurrency(poolValues.totalLiquidity)
                  ) : (
                    <Skeleton height="30px" w="100px" />
                  )}
                </Heading>
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
                  Pool value
                </Text>
              </VStack>
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            cardProps={{
              ...commonNoisyCardProps.cardProps,
              borderBottomLeftRadius: 'none',
              borderTopLeftRadius: 'none',
              borderBottomRightRadius: 'none',
            }}
            contentProps={commonNoisyCardProps.contentProps}
          >
            <ZenGarden variant="diamond" sizePx="225px" />
            <VStack spacing="4" m="auto">
              <ElevatedIcon as={Gift} sizePx="48px" boxSize={5} />
              <VStack spacing="0">
                {poolValues ? (
                  <HStack spacing="xs">
                    <Heading size="h4">{getAprLabel(pool.dynamicData.apr.apr)}</Heading>
                    {pool.staking && <Icon as={StarsIcon} />}
                  </HStack>
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
                  LP yield APR
                </Text>
              </VStack>
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            cardProps={{
              ...commonNoisyCardProps.cardProps,
              borderBottomRightRadius: 'none',
              borderTopRightRadius: 'none',
              borderBottomLeftRadius: 'none',
              borderTopLeftRadius: 'none',
            }}
            contentProps={commonNoisyCardProps.contentProps}
          >
            <ZenGarden variant="square" sizePx="225px" />
            <VStack spacing="4" m="auto">
              <ElevatedIcon as={BarChart} sizePx="48px" boxSize={5} />
              <VStack spacing="0">
                <Heading size="h4">
                  {poolValues ? (
                    toCurrency(poolValues.volume24h)
                  ) : (
                    <Skeleton height="30px" w="100px" />
                  )}
                </Heading>
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
                  Swap volume (24h)
                </Text>
              </VStack>
            </VStack>
          </NoisyCard>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <NoisyCard
            cardProps={{
              ...commonNoisyCardProps.cardProps,
              borderBottomLeftRadius: 'none',
              borderTopRightRadius: 'none',
              borderTopLeftRadius: 'none',
            }}
            contentProps={commonNoisyCardProps.contentProps}
          >
            <ZenGarden variant="circle" sizePx="225px" />
            <VStack spacing="4" m="auto">
              <ElevatedIcon as={Users} sizePx="48px" boxSize={5} />
              <VStack spacing="0">
                {poolValues && pool.dynamicData ? (
                  <Heading size="h4">{pool.dynamicData.holdersCount}</Heading>
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
                  Liquidity providers
                </Text>
              </VStack>
            </VStack>
          </NoisyCard>
        </GridItem>
      </Grid>
    </Card>
  )
}
