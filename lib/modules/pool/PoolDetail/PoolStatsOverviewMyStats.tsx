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
  myLiquidity: number
  myApr: string
  myPotentialWeeklyYield: string
  myClaimableRewards: number
}

const POSSIBLE_STAKED_BALANCE_USD = 10000

export function PoolMyStats() {
  const { pool, chain, isLoading: isLoadingPool } = usePool()
  const { toCurrency } = useCurrency()
  const { veBalBoostMap } = useVebalBoost([pool as unknown as GqlPoolMinimal])
  const { getToken } = useTokens()

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

  const boost = useMemo(() => {
    if (isEmpty(veBalBoostMap)) return
    return veBalBoostMap[pool.id]
  }, [veBalBoostMap])

  const myApr = getTotalAprLabel(pool.dynamicData?.apr.items, boost)

  // myApr should always be a 'single' percentage
  const myAprRaw = myApr.substring(0, myApr.length - 1)

  const poolMyStatsValues: PoolMyStatsValues | undefined = useMemo(() => {
    if (pool && pool.userBalance && !isLoadingPool && !isLoadingClaiming) {
      const totalBalanceUsd = pool.userBalance.totalBalanceUsd

      // TODO: only uses Balancer balances rn
      const stakedBalanceUsd = totalBalanceUsd
        ? pool.userBalance.stakedBalanceUsd
        : POSSIBLE_STAKED_BALANCE_USD

      return {
        // TODO: only uses Balancer balances rn
        myLiquidity: totalBalanceUsd,
        myApr,
        // TODO: only uses Balancer balances rn
        myPotentialWeeklyYield: bn(stakedBalanceUsd)
          .times(bn(bn(myAprRaw).div(100)).div(52))
          .toFixed(2),
        myClaimableRewards: myClaimableRewards,
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
          <Heading size="h4">
            {poolMyStatsValues.myLiquidity ? (
              toCurrency(poolMyStatsValues.myLiquidity)
            ) : (
              <>&mdash;</>
            )}
          </Heading>
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
            <Heading size="h4">
              {poolMyStatsValues.myLiquidity ? poolMyStatsValues.myApr : <>&mdash;</>}
            </Heading>
            {poolMyStatsValues.myLiquidity && pool.staking && <Icon as={StarsIcon} />}
          </HStack>
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          {`My potential weekly yield${
            poolMyStatsValues && !poolMyStatsValues.myLiquidity && ' on $10k'
          }`}
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{toCurrency(poolMyStatsValues.myPotentialWeeklyYield)}</Heading>
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
            <Heading size="h4">&mdash;</Heading>
          ) : (
            <HStack>
              <Heading size="h4">{toCurrency(poolMyStatsValues.myClaimableRewards)}</Heading>
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
