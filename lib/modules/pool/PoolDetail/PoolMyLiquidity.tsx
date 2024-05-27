'use client'

import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Button, Card, HStack, Heading, Skeleton, Stack, Text, VStack } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { usePool } from '../PoolProvider'
import { Address, parseUnits } from 'viem'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { keyBy } from 'lodash'
import { getTotalAprLabel, getProportionalExitAmountsFromScaledBptIn } from '../pool.utils'
import { BPT_DECIMALS } from '../pool.constants'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { bn } from '@/lib/shared/utils/numbers'
import { hasNestedPools } from '../pool.helpers'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { ZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import StakedBalanceDistributionChart from './PoolWeightCharts/StakedBalanceDistributionChart'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'

const TABS = [
  {
    value: 'total',
    label: 'Total',
  },
  {
    value: 'unstaked',
    label: 'Unstaked',
  },
  {
    value: 'staked',
    label: 'Staked',
  },
]

export default function PoolMyLiquidity() {
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])
  const { pool, chain, isLoadingOnchainUserBalances, myLiquiditySectionRef } = usePool()
  const { toCurrency } = useCurrency()
  const { isConnected, isConnecting } = useUserAccount()
  const { isMobile } = useBreakpoints()
  const router = useRouter()

  const pathname = usePathname()

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  function getBptBalanceForTab() {
    const parsedTotalBalance = parseUnits(pool.userBalance?.totalBalance || '0', BPT_DECIMALS)
    const parsedStakedBalance = parseUnits(pool.userBalance?.stakedBalance || '0', BPT_DECIMALS)
    const parsedUnstakedBalance = parseUnits(pool.userBalance?.walletBalance || '0', BPT_DECIMALS)

    switch (activeTab.value) {
      case 'total':
        return parsedTotalBalance
      case 'staked':
        return parsedStakedBalance
      case 'unstaked':
        return parsedUnstakedBalance
      default:
        return parsedTotalBalance
    }
  }

  function calcUserPoolTokenBalances() {
    return keyBy(
      getProportionalExitAmountsFromScaledBptIn(
        getBptBalanceForTab(),
        pool.poolTokens,
        pool.dynamicData.totalShares
      ),
      'address'
    )
  }

  function getTitlePrefix() {
    switch (activeTab.value) {
      case 'total':
        return 'total'
      case 'staked':
        return 'staked'
      case 'unstaked':
        return 'unstaked'
      default:
        return ''
    }
  }

  function getTotalBalanceUsd() {
    if (!isConnected || isConnecting) return 0

    switch (activeTab.value) {
      case 'total':
        return pool.userBalance?.totalBalanceUsd || 0
      case 'staked':
        return pool.userBalance?.stakedBalanceUsd || 0
      case 'unstaked':
        return pool.userBalance?.walletBalanceUsd || 0
      default:
        return pool.userBalance?.totalBalanceUsd || 0
    }
  }

  const totalBalanceUsd = getTotalBalanceUsd() || 0
  const poolTokenBalancesForTab = calcUserPoolTokenBalances()

  function tokenBalanceFor(tokenAddress: string) {
    if (!isConnected || isConnecting) return '0'

    return poolTokenBalancesForTab[tokenAddress].amount
  }

  const canStake = pool.staking
  const hasUnstakedBalance = bn(pool.userBalance?.walletBalance || '0').gt(0)
  const hasStakedBalance = bn(pool.userBalance?.stakedBalance || '0').gt(0)
  const aprLabel = getTotalAprLabel(pool.dynamicData?.apr.items)

  const displayTokens = hasNestedPools(pool)
    ? // we don't have the balances for pool.displayTokens for v2 boosted pools so we show bpt tokens balance as a workaround
      pool.poolTokens
    : pool.displayTokens

  const options = useMemo(() => {
    return TABS.map(tab => ({
      ...tab,
      disabled: tab.value !== 'total' && !canStake,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool])

  return (
    pool.userBalance?.totalBalance && (
      <Card ref={myLiquiditySectionRef}>
        <Stack
          w="full"
          spacing="md"
          direction={{ base: 'column', lg: 'row' }}
          justifyContent="stretch"
        >
          <VStack spacing="md" width="full">
            <HStack width="full" justifyContent="space-between">
              <Heading bg="font.special" backgroundClip="text" fontWeight="bold" size="h5">
                My liquidity
              </Heading>
              <ButtonGroup
                size="xxs"
                currentOption={activeTab}
                options={options}
                onChange={handleTabChanged}
                width="70px"
              />
            </HStack>
            <Box width="full">
              <Card variant="subSection">
                <VStack spacing="md" width="full">
                  <Box pb="md" width="full" borderBottomWidth={1} borderColor="border.base">
                    <HStack width="full" justifyContent="space-between">
                      <VStack alignItems="flex-start">
                        <Heading fontWeight="bold" size="h6">
                          My {getTitlePrefix()} balance
                        </Heading>
                        <Text variant="secondary" fontSize="0.85rem">
                          APR
                        </Text>
                      </VStack>
                      <VStack alignItems="flex-end">
                        {isLoadingOnchainUserBalances || isConnecting ? (
                          <Skeleton w="12" h="5" />
                        ) : (
                          <Heading fontWeight="bold" size="h6">
                            {toCurrency(totalBalanceUsd)}
                          </Heading>
                        )}
                        <Text variant="secondary" fontSize="0.85rem">
                          {aprLabel}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                  <VStack spacing="md" width="full">
                    {displayTokens.map(token => {
                      return (
                        <TokenRow
                          chain={chain}
                          key={`my-liquidity-token-${token.address}`}
                          address={token.address as Address}
                          value={tokenBalanceFor(token.address)}
                          isLoading={isLoadingOnchainUserBalances || isConnecting}
                        />
                      )
                    })}
                  </VStack>
                  <HStack mt="md" width="full" justifyContent="flex-start">
                    <Button
                      onClick={() => router.push(`${pathname}/add-liquidity`)}
                      variant="primary"
                      flex="1"
                    >
                      Add
                    </Button>
                    <Button
                      onClick={() => router.push(`${pathname}/remove-liquidity`)}
                      variant={hasUnstakedBalance ? 'tertiary' : 'disabled'}
                      isDisabled={!hasUnstakedBalance}
                      flex="1"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => router.push(`${pathname}/stake`)}
                      variant={canStake && hasUnstakedBalance ? 'secondary' : 'disabled'}
                      isDisabled={!(canStake && hasUnstakedBalance)}
                      flex="1"
                    >
                      Stake
                    </Button>
                    <Button
                      onClick={() => router.push(`${pathname}/unstake`)}
                      variant={hasStakedBalance ? 'tertiary' : 'disabled'}
                      isDisabled={!hasStakedBalance}
                      flex="1"
                    >
                      Unstake
                    </Button>
                  </HStack>
                </VStack>
              </Card>
            </Box>
          </VStack>
          <Box w="full" minH="320px" display="flex" justifyContent="stretch">
            <NoisyCard
              cardProps={{ position: 'relative', overflow: 'hidden' }}
              contentProps={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <StakedBalanceDistributionChart pool={pool} isSmall={isMobile} />
              {!isMobile && <ZenGarden variant="pill" sizePx="80%" heightPx="80%" />}
            </NoisyCard>
          </Box>
        </Stack>
      </Card>
    )
  )
}
