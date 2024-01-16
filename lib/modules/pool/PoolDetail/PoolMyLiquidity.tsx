'use client'

import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Button, Card, HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { usePool } from '../usePool'
import { Address, parseUnits } from 'viem'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { keyBy } from 'lodash'
import { getProportionalExitAmountsFromScaledBptIn } from '../pool.utils'
import { BPT_DECIMALS } from '../pool.constants'

const TABS = [
  {
    value: 'all',
    label: 'All',
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
  const [activeTab, setActiveTab] = useState(TABS[0])
  const { pool, chain, isLoadingOnchainUserBalances } = usePool()
  const { toCurrency } = useCurrency()

  const pathname = usePathname()

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  function getBptBalanceForTab() {
    const parsedTotalBalance = parseUnits(pool.userBalance?.totalBalance || '0', BPT_DECIMALS)
    const parsedStakedBalance = parseUnits(pool.userBalance?.stakedBalance || '0', BPT_DECIMALS)
    const parsedUnstakedBalance = parseUnits(pool.userBalance?.walletBalance || '0', BPT_DECIMALS)

    switch (activeTab.value) {
      case 'all':
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
        pool.tokens,
        pool.dynamicData.totalShares
      ),
      'address'
    )
  }

  function getTitlePrefix() {
    switch (activeTab.value) {
      case 'all':
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
    switch (activeTab.value) {
      case 'all':
        return pool.userBalance?.totalBalanceUsd || 0
      case 'staked':
        return pool.userBalance?.stakedBalanceUsd || 0
      case 'unstaked':
        return pool.userBalance?.walletBalanceUsd || 0
      default:
        return pool.userBalance?.totalBalanceUsd || 0
    }
  }

  const poolTokenBalancesForTab = calcUserPoolTokenBalances()

  function tokenBalanceFor(tokenAddress: string) {
    return poolTokenBalancesForTab[tokenAddress].amount
  }

  return (
    <Card variant="gradient" width="full" minHeight="320px">
      <VStack spacing="0" width="full">
        <HStack width="full" p="4" justifyContent="space-between">
          <Heading fontWeight="bold" size="h5">
            My liquidity
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
                      My {getTitlePrefix()} balance
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      APR range
                    </Text>
                  </VStack>
                  <VStack spacing="1" alignItems="flex-end">
                    <Heading fontWeight="bold" size="h6">
                      {isLoadingOnchainUserBalances ? (
                        <Skeleton w="12" h="6" />
                      ) : (
                        toCurrency(getTotalBalanceUsd() || 0)
                      )}
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      APRs TBD
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <VStack spacing="4" p="4" py="2" pb="4" width="full">
                {pool.displayTokens.map(token => {
                  return (
                    <TokenRow
                      chain={chain}
                      key={`my-liquidity-token-${token.address}`}
                      address={token.address as Address}
                      value={tokenBalanceFor(token.address)}
                      isLoading={isLoadingOnchainUserBalances}
                    />
                  )
                })}
              </VStack>
            </VStack>
            <HStack p="4" width="full" justifyContent="flex-start">
              <Button
                as={Link}
                href={`${pathname}/add-liquidity`}
                variant="primary"
                prefetch={true}
              >
                Add
              </Button>
              <Button
                as={Link}
                href={`${pathname}/remove-liquidity`}
                variant="primary"
                prefetch={true}
              >
                Remove
              </Button>
              <Button variant="disabled" isDisabled>
                Stake
              </Button>
              <Button variant="disabled" isDisabled>
                Unstake
              </Button>
            </HStack>
          </Card>
        </Box>
      </VStack>
    </Card>
  )
}
