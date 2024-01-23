import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Button, Card, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Address } from 'viem'
import { usePool } from '../usePool'
import { sumBy } from 'lodash'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

const TABS = [
  {
    value: 'pool',
    label: 'Pool',
  },
  {
    value: 'unclaimed',
    label: 'Unclaimed',
  },
  {
    value: 'my-total',
    label: 'My total',
  },
]

export default function PoolIncentives() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const { toCurrency } = useCurrency()
  const { pool, chain } = usePool()

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  const currentRewards = pool.staking?.gauge?.rewards || []
  const currentRewardsPerWeek = currentRewards.map(reward => {
    return {
      ...reward,
      rewardPerWeek: (parseFloat(reward.rewardPerSecond) * 86400) / 52,
    }
  })

  const totalRewardsPerWeek = sumBy(currentRewardsPerWeek, reward => reward.rewardPerWeek)

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
                    <Text variant="secondary" fontSize="0.85rem">
                      Gauge votes
                    </Text>
                  </VStack>
                  <VStack spacing="1" alignItems="flex-end">
                    <Heading fontWeight="bold" size="h6">
                      {totalRewardsPerWeek}
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      Gauge votes TBD
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <VStack spacing="4" p="4" py="2" pb="4" width="full">
                {currentRewardsPerWeek.map(token => {
                  return (
                    <TokenRow
                      chain={chain}
                      key={`pool-gauge-reward-token-${token.tokenAddress}`}
                      address={token.tokenAddress as Address}
                      value={token.rewardPerWeek}
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
