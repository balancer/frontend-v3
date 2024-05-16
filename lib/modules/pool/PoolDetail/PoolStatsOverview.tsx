'use client'

import React, { useMemo, useState } from 'react'
import { BoxProps, Card, VStack } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { getTotalAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { GqlPoolMinimal, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
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
import { PoolMyStats, PoolMyStatsValues } from './PoolStatsOverviewMyStats'
import { PoolStats, PoolStatsValues, TokenAndReward } from './PoolStatsOverviewStats'

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

export default function PoolStatsOverview() {
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])
  const { pool, chain, isLoading: isLoadingPool } = usePool()
  const { toCurrency } = useCurrency()
  const { veBalBoostMap } = useVebalBoost([pool as unknown as GqlPoolMinimal])
  const { priceFor, getToken } = useTokens()

  const {
    isLoading: isLoadingClaiming,
    hasNoRewards,
    balRewards,
    nonBalRewards,
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

  const tokensAndRewards: TokenAndReward[] = currentRewardsPerWeek.map(reward => {
    return {
      tokenAddress: reward.tokenAddress,
      rewardUsdPerWeek: priceFor(reward.tokenAddress, chain) * reward.rewardPerWeek,
    }
  })

  // reward tokens will always be there?
  const tokens = currentRewardsPerWeek.map(reward =>
    getToken(reward.tokenAddress, chain)
  ) as GqlToken[]

  const weeklyRewards = sumBy(tokensAndRewards, reward => reward.rewardUsdPerWeek)

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

  const poolStatsValues: PoolStatsValues | undefined = useMemo(() => {
    if (pool) {
      return {
        totalLiquidity: toCurrency(pool.dynamicData.totalLiquidity),
        fees24h: toCurrency(pool.dynamicData.fees24h),
        apr: getTotalAprLabel(pool.dynamicData.apr.items),
        weeklyRewards: toCurrency(weeklyRewards),
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

  const commonProps = {
    showStarsIcon: !!pool.staking,
    tokens,
    chain,
  }

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
            <PoolStats {...commonProps} poolStatsValues={poolStatsValues} />
          )}
          {activeTab.value === 'myStats' && (
            <PoolMyStats
              {...commonProps}
              poolMyStatsValues={poolMyStatsValues}
              hasNoRewards={hasNoRewards}
            />
          )}
        </VStack>
      </NoisyCard>
    </Card>
  )
}
