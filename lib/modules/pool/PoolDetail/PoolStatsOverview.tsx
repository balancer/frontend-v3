'use client'

import React, { useMemo, useState } from 'react'
import { BoxProps, Card, HStack, Heading, Icon, Skeleton, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../usePool'
import { getAprLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { GqlPoolAprValue } from '@/lib/shared/services/api/generated/graphql'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import StarsIcon from '@/lib/shared/components/icons/StarsIcon'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'
import { sumBy } from 'lodash'
import { useTokens } from '../../tokens/useTokens'

type PoolStatsValues = {
  totalLiquidity: string
  volume24h: string
  fees24h: string
  apr: GqlPoolAprValue
  weeklyIncentives: number
}

type PoolMyStatsValues = {
  myLiquidity: string
  myAPR: string
}

const COMMON_NOISY_CARD_PROPS: { contentProps: BoxProps; cardProps: BoxProps } = {
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

function PoolStats() {
  const { pool, chain } = usePool()
  const { priceFor } = useTokens()
  const { toCurrency } = useCurrency()

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
        totalLiquidity: pool.dynamicData.totalLiquidity,
        volume24h: pool.dynamicData.volume24h,
        fees24h: pool.dynamicData.fees24h,
        apr: pool.dynamicData.apr.apr,
        weeklyIncentives,
      }
    }
  }, [pool])

  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          TVL
        </Text>
        <Heading size="h4">
          {poolStatsValues ? (
            toCurrency(poolStatsValues.totalLiquidity)
          ) : (
            <Skeleton height="30px" w="100px" />
          )}
        </Heading>
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          APR for LPs
        </Text>
        {poolStatsValues ? (
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
        {poolStatsValues ? (
          <Heading size="h4">{toCurrency(poolStatsValues.fees24h)}</Heading>
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
            {poolStatsValues.weeklyIncentives
              ? toCurrency(poolStatsValues.weeklyIncentives)
              : 'N/A'}
          </Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
    </>
  )
}

function PoolMyStats() {
  const { pool } = usePool()
  const { toCurrency } = useCurrency()

  const poolMyStatsValues: PoolMyStatsValues | undefined = useMemo(() => {
    if (pool) {
      return {
        myLiquidity: pool.userBalance?.totalBalance || '0',
        myAPR: getAprLabel(pool.dynamicData.apr.apr),
      }
    }
  }, [pool])

  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My liquidity
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{toCurrency(poolMyStatsValues.myLiquidity)}</Heading>
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
            <Heading size="h4">{getAprLabel(pool.dynamicData.apr.apr)}</Heading>
            {pool.staking && <Icon as={StarsIcon} />}
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
          <Heading size="h4">{toCurrency(poolMyStatsValues.myLiquidity)}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondaryGradient" fontWeight="semibold" fontSize="sm" mt="xxs">
          My claimable incentives
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{toCurrency(poolMyStatsValues.myLiquidity)}</Heading>
        ) : (
          <Skeleton height="30px" w="100px" />
        )}
      </VStack>
    </>
  )
}

export default function PoolStatsOverview() {
  const { pool } = usePool()
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  const options = useMemo(() => {
    return TABS.map(tab => ({
      ...tab,
      disabled: tab.value === 'myStats' && !pool.userBalance?.totalBalance,
    }))
  }, [pool])

  return (
    <Card h="full" position="relative" p="md">
      <NoisyCard
        cardProps={{
          ...COMMON_NOISY_CARD_PROPS.cardProps,
          borderBottomLeftRadius: 'none',
          borderTopLeftRadius: 'none',
          borderBottomRightRadius: 'none',
        }}
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
          {activeTab.value === 'poolStats' && <PoolStats />}
          {activeTab.value === 'myStats' && <PoolMyStats />}
        </VStack>
      </NoisyCard>
    </Card>
  )
}
