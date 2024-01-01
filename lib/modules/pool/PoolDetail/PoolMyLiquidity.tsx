'use client'

import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Button, Card, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { usePool } from '../usePool'
import { Address, parseUnits } from 'viem'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { keyBy, sumBy } from 'lodash'
import { getProportionalExitAmountsFromScaledBptIn } from '../pool.utils'
import { useTokens } from '../../tokens/useTokens'
import { useChainUserPoolBalances } from '../useChainUserPoolBalances'

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
  // {
  //   value: 'third-parties',
  //   label: '3rd parties',
  // },
]
export default function PoolMyLiquidity() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const { pool, chain } = usePool()
  const { toCurrency } = useCurrency()
  const { getToken, usdValueForToken } = useTokens()
  const { userBalance } = useChainUserPoolBalances()

  const pathname = usePathname()

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  function getBalanceToUseForTokenAmounts(useTotalRegardless?: boolean) {
    if (useTotalRegardless) {
      return parseUnits(userBalance?.totalBalance || '0', 18)
    }
    switch (activeTab.value) {
      case 'all':
        return parseUnits(userBalance?.totalBalance || '0', 18)
      case 'staked':
        return parseUnits(userBalance?.stakedBalance || '0', 18)
      case 'unstaked':
        return (
          parseUnits(userBalance?.stakedBalance || '0', 18) -
          parseUnits(userBalance?.totalBalance || '0', 18)
        )
      default:
        return parseUnits(userBalance?.totalBalance || '0', 18)
    }
  }

  function calculateUserPoolTokenBalances(useTotalRegardless?: boolean) {
    return keyBy(
      getProportionalExitAmountsFromScaledBptIn(
        getBalanceToUseForTokenAmounts(useTotalRegardless),
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
    const tokenBalances = calculateUserPoolTokenBalances(true)
    const totalBalanceUsd = sumBy(Object.values(tokenBalances), tokenBalance =>
      parseFloat(usdValueForToken(getToken(tokenBalance.address, chain), tokenBalance.amount))
    )

    switch (activeTab.value) {
      case 'all':
        return totalBalanceUsd
      case 'staked':
        return userBalance?.stakedBalanceUsd
      case 'unstaked':
        return totalBalanceUsd - (userBalance?.stakedBalanceUsd || 0)
      default:
        return totalBalanceUsd
    }
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
                      {toCurrency(getTotalBalanceUsd() || 0)}
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      8.69%-12.34%
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
                      // TODO: Fill pool balances
                      value={calculateUserPoolTokenBalances()[token.address].amount}
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
