'use client'

import React, { useMemo, useState } from 'react'
import { BoxProps, Card, HStack, Heading, Icon, Skeleton, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { getTotalAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { GqlPoolMinimal } from '@/lib/shared/services/api/generated/graphql'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'
import { isEmpty, sumBy } from 'lodash'
import { useTokens } from '../../tokens/useTokens'
import { bn } from '@/lib/shared/utils/numbers'
import { useVebalBoost } from '../../vebal/useVebalBoost'
import { useClaiming } from '../actions/claim/useClaiming'
import { PoolListItem } from '../pool.types'

type PoolStatsValues = {
  totalLiquidity: string
  fees24h: string
  apr: string
  weeklyIncentives: string
}

type PoolMyStatsValues = {
  myLiquidity: string
  myApr: string
  myPotentialWeeklyYield: string
  myClaimableIncentives: string
}

const COMMON_NOISY_CARD_PROPS: { contentProps: BoxProps; cardProps: BoxProps } = {
  contentProps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 'none',
    borderTopLeftRadius: 'none',
    borderBottomRightRadius: 'none',
  },
  cardProps: {
    position: 'relative',
    overflow: 'hidden',
  },
}

const TABS = [
  {
    value: 'poolStats',
    label: 'Pool stats',
  },
  {
    value: 'myStats',
    label: 'My stats',
  },
]

function PoolStats({
  poolStatsValues,
  showStarsIcon,
}: {
  poolStatsValues: PoolStatsValues | undefined
  showStarsIcon: boolean
}) {
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
          <Heading size="h4">
            {poolStatsValues.weeklyIncentives ? poolStatsValues.weeklyIncentives : 'N/A'}
          </Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
    </>
  )
}

function PoolMyStats({
  poolMyStatsValues,
  showStarsIcon,
}: {
  poolMyStatsValues: PoolMyStatsValues | undefined
  showStarsIcon: boolean
}) {
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
          My claimable incentives
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{poolMyStatsValues.myClaimableIncentives}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
    </>
  )
}

export default function PoolStatsOverview() {
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])
  const { pool, chain, isLoading: isLoadingPool } = usePool()
  const { toCurrency } = useCurrency()
  const { veBalBoostMap } = useVebalBoost([pool as unknown as GqlPoolMinimal])
  const { priceFor } = useTokens()

  const {
    isLoading: isLoadingClaiming,
    hasNoRewards,
    balRewards,
    nonBalRewards,
  } = useClaiming([pool] as unknown[] as PoolListItem[])

  const claimableRewards = [...balRewards, ...nonBalRewards]
  const myClaimableIncentives = sumBy(claimableRewards, reward => reward.fiatBalance.toNumber())

  const boost = useMemo(() => {
    if (isEmpty(veBalBoostMap)) return
    return veBalBoostMap[pool.id]
  }, [veBalBoostMap])

  const myApr = getTotalAprLabel(pool.dynamicData?.apr.items, boost)
  const myAprRaw = myApr.substring(0, myApr.length - 1)

  const poolMyStatsValues: PoolMyStatsValues | undefined = useMemo(() => {
    if (pool && pool.userBalance && !isLoadingPool && !isLoadingClaiming) {
      return {
        myLiquidity: toCurrency(pool.userBalance.totalBalanceUsd),
        myApr,
        myPotentialWeeklyYield: toCurrency(
          bn(pool.userBalance.stakedBalanceUsd)
            .times(bn(bn(myAprRaw).div(100)).div(52))
            .toFixed(2)
        ),
        myClaimableIncentives: hasNoRewards
          ? 'No incentives to claim'
          : toCurrency(myClaimableIncentives),
      }
    }
  }, [veBalBoostMap, pool])

  const poolStatsValues: PoolStatsValues | undefined = useMemo(() => {
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

      return {
        totalLiquidity: toCurrency(pool.dynamicData.totalLiquidity),
        fees24h: toCurrency(pool.dynamicData.fees24h),
        apr: getTotalAprLabel(pool.dynamicData.apr.items),
        weeklyIncentives: toCurrency(weeklyIncentives),
      }
    }
  }, [pool])

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  const options = useMemo(() => {
    return TABS.map(tab => ({
      ...tab,
      disabled: tab.value === 'myStats' && pool.userBalance?.totalBalance === '0.0',
    }))
  }, [pool])

  return (
    <Card h="full" position="relative" p="md">
      <NoisyCard
        cardProps={COMMON_NOISY_CARD_PROPS.cardProps}
        contentProps={COMMON_NOISY_CARD_PROPS.contentProps}
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
            currentOption={activeTab}
            options={options}
            onChange={handleTabChanged}
            width="70px"
          />
          {activeTab.value === 'poolStats' && (
            <PoolStats poolStatsValues={poolStatsValues} showStarsIcon={!!pool.staking} />
          )}
          {activeTab.value === 'myStats' && (
            <PoolMyStats poolMyStatsValues={poolMyStatsValues} showStarsIcon={!!pool.staking} />
          )}
        </VStack>
      </NoisyCard>
    </Card>
  )
}
