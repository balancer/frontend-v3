'use client'

import React from 'react'
import { HStack, Heading, Icon, Skeleton, Text, VStack } from '@chakra-ui/react'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'

import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { TokenIconStack } from '../../tokens/TokenIconStack'

export type PoolStatsValues = {
  totalLiquidity: string
  fees24h: string
  apr: string
  weeklyRewards: string
}

export type TokenAndReward = {
  tokenAddress: string
  rewardUsdPerWeek: number
}

type PoolStatsProps = {
  poolStatsValues: PoolStatsValues | undefined
  showStarsIcon: boolean
  tokens: GqlToken[]
  chain: GqlChain
  tokensAndRewards?: TokenAndReward[]
}

export function PoolStats({
  poolStatsValues,
  showStarsIcon,
  tokensAndRewards,
  tokens,
  chain,
}: PoolStatsProps) {
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
        {poolStatsValues ? (
          <HStack spacing="xs">
            <Heading size="h4">{poolStatsValues.apr}</Heading>
            {showStarsIcon && <Icon as={StarsIcon} />}
          </HStack>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
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
