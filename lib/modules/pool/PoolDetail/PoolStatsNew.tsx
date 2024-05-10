'use client'

import React, { useEffect, useState } from 'react'
import { BoxProps, Card, HStack, Heading, Icon, Skeleton, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { getAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { GqlPoolAprValue } from '@/lib/shared/services/api/generated/graphql'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'
import { sumBy } from 'lodash'
import { useTokens } from '../../tokens/useTokens'

interface PoolValues {
  totalLiquidity: string
  volume24h: string
  fees24h: string
  apr: GqlPoolAprValue
  weeklyIncentives: number
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

const tabs = [
  {
    value: 'poolStats',
    label: 'Pool stats',
  },
  {
    value: 'myStats',
    label: 'My stats',
  },
]

export default function PoolStats() {
  const { pool, chain } = usePool()
  const { toCurrency } = useCurrency()
  const { priceFor } = useTokens()
  const [poolValues, setPoolValues] = useState<PoolValues | null>(null)

  useEffect(() => {
    if (pool) {
      const currentRewards = pool.staking?.gauge?.rewards || []
      const currentRewardsPerWeek = currentRewards.map(reward => {
        return {
          ...reward,
          rewardPerWeek: parseFloat(reward.rewardPerSecond) * SECONDS_IN_DAY * 7,
        }
      })

      const weeklyIncentives = sumBy(
        currentRewardsPerWeek,
        reward => priceFor(reward.tokenAddress, chain) * reward.rewardPerWeek
      )

      setPoolValues({
        totalLiquidity: pool.dynamicData.totalLiquidity,
        volume24h: pool.dynamicData.volume24h,
        fees24h: pool.dynamicData.fees24h,
        apr: pool.dynamicData.apr.apr,
        weeklyIncentives,
      })
    }
  }, [pool])

  return (
    <Card h="full" position="relative" p="md">
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
        <VStack
          spacing="xl"
          m="auto"
          align="flex-start"
          w="full"
          justify="flex-start"
          mb="8"
          p="md"
          zIndex={1}
        >
          <ButtonGroup
            size="xxs"
            currentOption={tabs[0]}
            options={tabs}
            onChange={option => console.log(option)}
          />
          <VStack spacing="0" align="flex-start" w="full">
            <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
              TVL
            </Text>
            <Heading size="h4">
              {poolValues ? (
                toCurrency(poolValues.totalLiquidity)
              ) : (
                <Skeleton height="30px" w="100px" />
              )}
            </Heading>
          </VStack>
          <VStack spacing="0" align="flex-start" w="full">
            <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
              APR for LPs
            </Text>
            {poolValues ? (
              <HStack spacing="xs">
                <Heading size="h4">{getAprLabel(pool.dynamicData.apr.apr)}</Heading>
                {pool.staking && <Icon as={StarsIcon} />}
              </HStack>
            ) : (
              <Skeleton height="30px" w="100px" />
            )}
          </VStack>
          <VStack spacing="0" align="flex-start" w="full">
            <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
              Fees (24h)
            </Text>
            {poolValues ? (
              <Heading size="h4">{toCurrency(poolValues.fees24h)}</Heading>
            ) : (
              <Skeleton height="30px" w="100px" />
            )}
          </VStack>
          <VStack spacing="0" align="flex-start" w="full">
            <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
              Weekly incentives
            </Text>
            {poolValues ? (
              <Heading size="h4">
                {poolValues.weeklyIncentives ? toCurrency(poolValues.weeklyIncentives) : 'N/A'}
              </Heading>
            ) : (
              <Skeleton height="30px" w="100px" />
            )}
          </VStack>
        </VStack>
      </NoisyCard>
    </Card>
  )
}
