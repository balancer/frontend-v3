'use client'

import React, { memo, useMemo } from 'react'
import { HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { TokenIconStack } from '../../tokens/TokenIconStack'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'
import { sumBy } from 'lodash'
import { useTokens } from '../../tokens/useTokens'
import { usePool } from '../usePool'
import AprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/AprTooltip'

export type PoolStatsValues = {
  totalLiquidity: string
  fees24h: string
  weeklyRewards: string
}

export function PoolStats() {
  const { pool, chain } = usePool()
  const { toCurrency } = useCurrency()
  const { priceFor, getToken } = useTokens()

  const MemoizedAprTooltip = memo(AprTooltip)

  // TODO: only uses Balancer rewards rn
  const currentRewards = pool.staking?.gauge?.rewards || []
  const currentRewardsPerWeek = currentRewards.map(reward => {
    return {
      ...reward,
      rewardPerWeek: parseFloat(reward.rewardPerSecond) * SECONDS_IN_DAY * 7,
    }
  })

  // reward tokens will always be there?
  const tokens = currentRewardsPerWeek.map(reward =>
    getToken(reward.tokenAddress, chain)
  ) as GqlToken[]

  const weeklyRewards = sumBy(
    currentRewardsPerWeek,
    reward => priceFor(reward.tokenAddress, chain) * reward.rewardPerWeek
  )

  const poolStatsValues: PoolStatsValues | undefined = useMemo(() => {
    if (pool) {
      return {
        totalLiquidity: toCurrency(pool.dynamicData.totalLiquidity, { abbreviated: false }),
        fees24h: toCurrency(pool.dynamicData.fees24h),
        weeklyRewards: toCurrency(weeklyRewards),
      }
    }
  }, [pool])

  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          TVL
        </Text>
        {poolStatsValues ? (
          <Heading size="h4">{poolStatsValues.totalLiquidity}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          APR for LPs
        </Text>
        <MemoizedAprTooltip
          data={pool.dynamicData.apr}
          poolId={pool.id}
          textProps={{
            fontWeight: 'medium',
            fontSize: '2xl',
            lineHeight: '28px',
          }}
        />
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          Fees (24h)
        </Text>
        {poolStatsValues ? (
          <Heading size="h4">{poolStatsValues.fees24h}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          Weekly incentives
        </Text>
        {poolStatsValues ? (
          <HStack>
            <Heading size="h4">
              {poolStatsValues.weeklyRewards ? poolStatsValues.weeklyRewards : 'N/A'}
            </Heading>
            <TokenIconStack tokens={tokens} chain={chain} size={20} />
          </HStack>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
    </>
  )
}
