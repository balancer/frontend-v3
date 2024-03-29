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
import { GqlPoolAprValue, GqlPoolType } from '@/lib/shared/services/api/generated/graphql'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { BarChart, Gift, Shield, Users } from 'react-feather'
import { ElevatedIcon } from '@/lib/shared/components/icons/ElevatedIcon'
import { isClp, isStable, isWeighted } from '../pool.helpers'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'

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

function MainZenSymbol({ poolType }: { poolType: GqlPoolType }) {
  if (isWeighted(poolType)) {
    return <ZenGarden variant="circle" sizePx="400px" />
  }
  if (isStable(poolType)) {
    return <ZenGarden variant="square" sizePx="400px" />
  }
  if (isClp(poolType)) {
    return <ZenGarden variant="diamond" sizePx="400px" />
  }
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
      width="full"
      height="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      p={0}
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
            cardProps={{
              ...commonNoisyCardProps.cardProps,
              borderTopRightRadius: 'none',
              borderBottomRightRadius: 'none',
            }}
            contentProps={commonNoisyCardProps.contentProps}
          >
            <MainZenSymbol poolType={pool.type} />
            <Box mt="-6">
              <PoolWeightChart pool={pool} chain={chain} />
            </Box>
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
                <Heading fontSize="2xl">
                  {poolValues ? (
                    toCurrency(poolValues.totalLiquidity)
                  ) : (
                    <Skeleton height="30px" w="100px" />
                  )}
                </Heading>
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm">
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
                  <HStack>
                    <Heading fontSize="2xl">{getAprLabel(pool.dynamicData.apr.apr)}</Heading>
                    <Icon as={StarsIcon} />
                  </HStack>
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm">
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
                <Heading fontSize="2xl">
                  {poolValues ? (
                    toCurrency(poolValues.volume24h)
                  ) : (
                    <Skeleton height="30px" w="100px" />
                  )}
                </Heading>
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm">
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
                  <Heading fontSize="2xl">{pool.dynamicData.holdersCount}</Heading>
                ) : (
                  <Skeleton height="30px" w="100px" />
                )}
                <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm">
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
