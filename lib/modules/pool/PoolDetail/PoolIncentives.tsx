import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Button, Card, HStack, Heading, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Address, parseUnits } from 'viem'
import { usePool } from '../usePool'
import { sumBy } from 'lodash'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useTokens } from '../../tokens/useTokens'
import { useGaugeBalances } from '../../gauge/useGaugeBalances'

const TABS = [
  {
    value: 'pool',
    label: 'Pool',
  },
  {
    value: 'unclaimed',
    label: 'Unclaimed',
  },
]

export default function PoolIncentives() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const { toCurrency } = useCurrency()
  const { pool, chain } = usePool()
  const { priceFor, getToken } = useTokens()
  const { rewards } = useGaugeBalances([pool])

  const claimableRewardsForPool = rewards[pool.address] || {}
  const currentRewards = pool.staking?.gauge?.rewards || []

  const parsedClaimableRewards = Object.keys(claimableRewardsForPool).map(tokenAddress => {
    const tokenInfo = getToken(tokenAddress, chain)
    const rewardInfo = claimableRewardsForPool[tokenAddress]
    const parsedClaimableReward = parseUnits(rewardInfo?.result || '0', tokenInfo?.decimals || 18)
    return {
      ...rewardInfo,
      claimableReward: parsedClaimableReward.toString(),
      tokenAddress,
    }
  })

  const currentRewardsPerWeek = currentRewards.map(reward => {
    return {
      ...reward,
      rewardPerWeek: (parseFloat(reward.rewardPerSecond) * 86400) / 52,
    }
  })

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  function getRewardListForTab() {
    switch (activeTab.value) {
      case 'pool':
        return currentRewardsPerWeek
      case 'unclaimed':
        return parsedClaimableRewards
      default:
        return currentRewardsPerWeek
    }
  }

  function getRewardKeyForTab() {
    switch (activeTab.value) {
      case 'pool':
        return 'rewardPerWeek'
      case 'unclaimed':
        return 'claimableReward'
      default:
        return 'rewardPerWeek'
    }
  }

  function getTotalForTab() {
    const totalRewardsPerWeek = sumBy(
      currentRewardsPerWeek,
      reward => priceFor(reward.tokenAddress, chain) * reward.rewardPerWeek
    )

    const claimableRewards = sumBy(
      parsedClaimableRewards,
      r => priceFor(r.tokenAddress, chain) * r.claimableReward
    )

    switch (activeTab.value) {
      case 'pool':
        return totalRewardsPerWeek
      case 'unclaimed':
        return claimableRewards
      default:
        return totalRewardsPerWeek
    }
  }

  return (
    <Card variant="gradient" width="full" minHeight="320px">
      <VStack spacing="0" width="full">
        <HStack width="full" p="4" justifyContent="space-between">
          <Heading fontWeight="bold" size="h5">
            Incentives
          </Heading>
          <ButtonGroup currentOption={activeTab} options={TABS} onChange={handleTabChanged} />
        </HStack>
        <Box width="full" p="4" pt="0">
          <Card borderWidth={1} variant="level5" shadow="none">
            <VStack width="full">
              <Box width="full" borderBottomWidth={1} borderColor="borderColor">
                <HStack py="4" px="4" width="full" justifyContent="space-between">
                  <VStack spacing="1" alignItems="flex-start">
                    <Heading fontWeight="bold" size="h6">
                      Pool incentives this week
                    </Heading>
                  </VStack>
                  <VStack spacing="1" alignItems="flex-end">
                    <Heading fontWeight="bold" size="h6">
                      {toCurrency(getTotalForTab())}
                    </Heading>
                  </VStack>
                </HStack>
              </Box>
              <VStack spacing="4" p="4" py="2" pb="4" width="full">
                {getRewardListForTab().map(token => {
                  return (
                    <TokenRow
                      chain={chain}
                      key={`pool-gauge-reward-token-${token.tokenAddress}`}
                      address={token.tokenAddress as Address}
                      value={token[getRewardKeyForTab()]}
                    />
                  )
                })}
              </VStack>
            </VStack>
            <HStack p="4" width="full" justifyContent="flex-start">
              <Button variant="secondary">Vote</Button>
              <Button variant="disabled" isDisabled>
                Incentivize
              </Button>
            </HStack>
          </Card>
        </Box>
      </VStack>
    </Card>
  )
}
