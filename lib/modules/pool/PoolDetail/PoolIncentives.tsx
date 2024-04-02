'use client'

import TokenRow from '../../tokens/TokenRow/TokenRow'
import { Button, Stack, HStack, Tooltip, VStack } from '@chakra-ui/react'
import React from 'react'
import { Address } from 'viem'
import { usePool } from '../usePool'
import { useClaiming } from '../actions/claim/useClaiming'
import { ClaimModal } from '../actions/claim/ClaimModal'
import { Hex } from 'viem'
import { PoolListItem } from '../pool.types'
import { IncentiveBadge } from '@/lib/shared/components/other/IncentiveBadge'
import { useTokens } from '../../tokens/useTokens'
import { sumBy } from 'lodash'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'

export default function PoolIncentives() {
  const { pool, chain } = usePool()
  const { priceFor } = useTokens()
  const { toCurrency } = useCurrency()
  const {
    previewModalDisclosure,
    disabledReason,
    isDisabled,
    hasNoRewards,
    balRewards,
    nonBalRewards,
  } = useClaiming([pool] as unknown[] as PoolListItem[])

  const claimableRewards = [...balRewards, ...nonBalRewards]

  const currentRewards = pool.staking?.gauge?.rewards || []
  const currentRewardsPerWeek = currentRewards.map(reward => {
    return {
      ...reward,
      rewardPerWeek: parseFloat(reward.rewardPerSecond) * SECONDS_IN_DAY * 7,
    }
  })

  const totalRewardsPerWeekUsd = sumBy(
    currentRewardsPerWeek,
    reward => priceFor(reward.tokenAddress, chain) * reward.rewardPerWeek
  )
  const totalClaimableRewards = sumBy(claimableRewards, reward => reward.fiatBalance.toNumber())

  function onModalClose() {
    previewModalDisclosure.onClose()
  }

  return (
    <VStack width="full">
      <Stack
        spacing="4"
        width="full"
        alignItems="flex-start"
        direction={{ base: 'column', md: 'row' }}
      >
        <IncentiveBadge
          label="Pool incentives (1w)"
          value={toCurrency(totalRewardsPerWeekUsd)}
          width="full"
        >
          <VStack spacing="6" p="2" pb="0" width="full">
            {currentRewardsPerWeek.map(reward => {
              return (
                <TokenRow
                  chain={chain}
                  key={`my-liquidity-token-${reward.tokenAddress}`}
                  address={reward.tokenAddress as Address}
                  value={reward.rewardPerWeek}
                />
              )
            })}
          </VStack>
        </IncentiveBadge>
        <IncentiveBadge
          special
          label="Claimable incentives"
          value={toCurrency(totalClaimableRewards)}
          width="full"
        >
          <VStack width="full" spacing="6" alignItems="flex-start">
            <VStack spacing="6" p="2" pb="0" width="full">
              {claimableRewards.map(reward => {
                return (
                  <TokenRow
                    chain={chain}
                    key={`token-claimable-${reward.tokenAddress}`}
                    address={reward.tokenAddress as Address}
                    value={reward.fiatBalance}
                  />
                )
              })}
            </VStack>
            <HStack justifyContent="flex-start">
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  variant="primary"
                  w="full"
                  size="sm"
                  isDisabled={isDisabled || hasNoRewards}
                  onClick={() => !isDisabled && previewModalDisclosure.onOpen()}
                >
                  Claim
                </Button>
              </Tooltip>
            </HStack>
          </VStack>
        </IncentiveBadge>
      </Stack>

      <ClaimModal
        isOpen={previewModalDisclosure.isOpen}
        onOpen={previewModalDisclosure.onOpen}
        onClose={onModalClose}
        gaugeAddresses={[(pool.staking?.id || '') as Hex]}
        pool={pool as unknown as PoolListItem}
      />
    </VStack>
  )
}
