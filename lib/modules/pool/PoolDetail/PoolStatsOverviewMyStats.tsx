'use client'

import React from 'react'
import { HStack, Heading, Icon, Skeleton, Text, VStack } from '@chakra-ui/react'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { TokenIconStack } from '../../tokens/TokenIconStack'
import { GqlToken, GqlChain } from '@/lib/shared/services/api/generated/graphql'

export type PoolMyStatsValues = {
  myLiquidity: string
  myApr: string
  myPotentialWeeklyYield: string
  myClaimableRewards: string
}

type PoolMyStatsProps = {
  poolMyStatsValues: PoolMyStatsValues | undefined
  showStarsIcon: boolean
  hasNoRewards: boolean
  tokens: GqlToken[]
  chain: GqlChain
}

export function PoolMyStats({
  poolMyStatsValues,
  showStarsIcon,
  hasNoRewards,
  tokens,
  chain,
}: PoolMyStatsProps) {
  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My liquidity
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{poolMyStatsValues.myLiquidity}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My APR
        </Text>
        {poolMyStatsValues ? (
          <HStack spacing="xs">
            <Heading size="h4">{poolMyStatsValues.myApr}</Heading>
            {showStarsIcon && <Icon as={StarsIcon} />}
          </HStack>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My potential weekly yield
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{poolMyStatsValues.myPotentialWeeklyYield}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My claimable rewards
        </Text>
        {poolMyStatsValues ? (
          hasNoRewards ? (
            <Heading size="h4">--</Heading>
          ) : (
            <HStack>
              <Heading size="h4">{poolMyStatsValues.myClaimableRewards}</Heading>
              <TokenIconStack tokens={tokens} chain={chain} size={20} />
            </HStack>
          )
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
    </>
  )
}
