'use client'

import React, { useMemo } from 'react'
import { Button, HStack, Heading, Icon, Skeleton, Text, Tooltip, VStack } from '@chakra-ui/react'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { TokenIconStack } from '../../tokens/TokenIconStack'
import { GqlToken, GqlPoolMinimal } from '@/lib/shared/services/api/generated/graphql'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'
import { sumBy, isEmpty } from 'lodash'
import { useTokens } from '../../tokens/useTokens'
import { useVebalBoost } from '../../vebal/useVebalBoost'
import { useClaiming } from '../actions/claim/useClaiming'
import { PoolListItem } from '../pool.types'
import { getTotalAprLabel } from '../pool.utils'
import { usePool } from '../usePool'
import { bn } from '@/lib/shared/utils/numbers'
import { ClaimModal } from '../actions/claim/ClaimModal'
import { Hex } from 'viem'

export type PoolMyStatsValues = {
  myLiquidity: string
  myApr: string
  myPotentialWeeklyYield: string
  myClaimableRewards: string
}

export function PoolMyStats() {
  const { pool, chain, isLoading: isLoadingPool } = usePool()
  const { toCurrency } = useCurrency()
  const { veBalBoostMap } = useVebalBoost([pool as unknown as GqlPoolMinimal])
  const { priceFor, getToken } = useTokens()

  const {
    isLoading: isLoadingClaiming,
    hasNoRewards,
    balRewards,
    nonBalRewards,
    previewModalDisclosure,
    disabledReason,
    isDisabled,
  } = useClaiming([pool] as unknown[] as PoolListItem[])

  // TODO: only uses Balancer rewards rn
  const claimableRewards = [...balRewards, ...nonBalRewards]
  const myClaimableRewards = sumBy(claimableRewards, reward => reward.fiatBalance.toNumber())

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

  const boost = useMemo(() => {
    if (isEmpty(veBalBoostMap)) return
    return veBalBoostMap[pool.id]
  }, [veBalBoostMap])

  const myApr = getTotalAprLabel(pool.dynamicData?.apr.items, boost)

  // myApr should always be a 'single' percentage
  const myAprRaw = myApr.substring(0, myApr.length - 1)

  const poolMyStatsValues: PoolMyStatsValues | undefined = useMemo(() => {
    if (pool && pool.userBalance && !isLoadingPool && !isLoadingClaiming) {
      return {
        // TODO: only uses Balancer balances rn
        myLiquidity: toCurrency(pool.userBalance.totalBalanceUsd),
        myApr,
        // TODO: only uses Balancer balances rn
        myPotentialWeeklyYield: toCurrency(
          bn(pool.userBalance.stakedBalanceUsd)
            .times(bn(bn(myAprRaw).div(100)).div(52))
            .toFixed(2)
        ),
        myClaimableRewards: toCurrency(myClaimableRewards),
      }
    }
  }, [veBalBoostMap, pool])

  function onModalClose() {
    previewModalDisclosure.onClose()
  }

  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My liquidity
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{poolMyStatsValues.myLiquidity}</Heading>
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My APR
        </Text>
        {poolMyStatsValues ? (
          <HStack spacing="xs">
            <Heading size="h4">{poolMyStatsValues.myApr}</Heading>
            {pool.staking && <Icon as={StarsIcon} />}
          </HStack>
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My potential weekly yield
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{poolMyStatsValues.myPotentialWeeklyYield}</Heading>
        ) : (
          <Skeleton height="28px" w="100px" />
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
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  variant="primary"
                  w="full"
                  size="xxs"
                  isDisabled={isDisabled}
                  onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                >
                  Claim
                </Button>
              </Tooltip>
            </HStack>
          )
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <ClaimModal
        isOpen={previewModalDisclosure.isOpen}
        onOpen={previewModalDisclosure.onOpen}
        onClose={onModalClose}
        gaugeAddresses={[(pool.staking?.id || '') as Hex]}
        pool={pool as unknown as PoolListItem}
      />
    </>
  )
}
