'use client'

import TokenRow from '../../tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import {
  Divider,
  Button,
  Card,
  HStack,
  Heading,
  Skeleton,
  Text,
  VStack,
  Tooltip,
  Link,
} from '@chakra-ui/react'
import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import { usePool } from '../PoolProvider'
import { Address } from 'viem'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { keyBy } from 'lodash'
import { getAuraPoolLink, getProportionalExitAmountsFromScaledBptIn } from '../pool.utils'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import {
  getUserTotalBalanceInt,
  getUserWalletBalanceInt,
  calcTotalStakedBalance,
  getUserTotalBalanceUsd,
  getUserWalletBalance,
  getUserWalletBalanceUsd,
  calcStakedBalanceInt,
  calcStakedBalanceUsd,
  shouldMigrateStake,
} from '../user-balance.helpers'
import { calcUserShareOfPool, hasNestedPools, shouldBlockAddLiquidity } from '../pool.helpers'
import { hasNonPreferentialStakedBalance, migrateStakeTooltipLabel } from '../actions/stake.helpers'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { ArrowUpRight } from 'react-feather'
import { getChainId } from '@/lib/config/app.config'

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
    value: 'gauge',
    label: 'Staked',
  },
]

export default function PoolMyLiquidity() {
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(TABS[0])
  const { pool, chain, isLoadingOnchainUserBalances, myLiquiditySectionRef } = usePool()
  const { toCurrency } = useCurrency()
  const { isConnected, isConnecting } = useUserAccount()
  const router = useRouter()
  const pathname = usePathname()
  const [height, setHeight] = useState(0)

  const isAddLiquidityBlocked = shouldBlockAddLiquidity(pool)

  useLayoutEffect(() => {
    if (myLiquiditySectionRef && myLiquiditySectionRef.current) {
      setHeight(myLiquiditySectionRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    if (
      pool.staking?.aura &&
      !pool.staking.aura.isShutdown &&
      TABS.findIndex(tab => tab.value === 'aura') === -1
    ) {
      TABS.push({
        value: 'aura',
        label: 'Aura',
      })
    } else if (!pool.staking?.aura) {
      const index = TABS.findIndex(tab => tab.value === 'aura')
      if (index > -1) {
        TABS.splice(index, 1)
      }
    }
  }, [pool])

  function handleTabChanged(option: ButtonGroupOption) {
    setActiveTab(option)
  }

  function getStakingType(tabsValue: string) {
    switch (tabsValue) {
      case 'gauge':
        return GqlPoolStakingType.Gauge
      case 'aura':
        return GqlPoolStakingType.Aura
      default:
        return GqlPoolStakingType.Gauge
    }
  }

  function getBptBalanceForTab() {
    const rawTotalBalance = getUserTotalBalanceInt(pool)

    switch (activeTab.value) {
      case 'total':
        return rawTotalBalance
      case 'gauge':
      case 'aura':
        return calcStakedBalanceInt(pool, getStakingType(activeTab.value))
      case 'unstaked':
        return getUserWalletBalanceInt(pool)
      default:
        return rawTotalBalance
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
        return 'My total balance'
      case 'gauge':
        return 'Staked on Balancer'
      case 'aura':
        return 'Staked on Aura'
      case 'unstaked':
        return 'My unstaked balance'
      default:
        return ''
    }
  }

  function getTotalBalanceUsd() {
    if (!isConnected || isConnecting) return 0

    switch (activeTab.value) {
      case 'total':
        return getUserTotalBalanceUsd(pool)
      case 'gauge':
      case 'aura':
        return calcStakedBalanceUsd(pool, getStakingType(activeTab.value))
      case 'unstaked':
        return getUserWalletBalanceUsd(pool)
      default:
        return getUserTotalBalanceUsd(pool)
    }
  }

  const totalBalanceUsd = getTotalBalanceUsd() || 0
  const poolTokenBalancesForTab = calcUserPoolTokenBalances()

  function tokenBalanceFor(tokenAddress: string) {
    if (!isConnected || isConnecting) return '0'

    return poolTokenBalancesForTab[tokenAddress].amount
  }

  const hasNonPreferentialBalance = hasNonPreferentialStakedBalance(pool)
  const canStake = pool.staking && !hasNonPreferentialBalance
  const hasUnstakedBalance = bn(getUserWalletBalance(pool)).gt(0)
  const hasStakedBalance = bn(calcTotalStakedBalance(pool)).gt(0)
  const shareOfPool = calcUserShareOfPool(pool)
  const shareofPoolLabel = bn(shareOfPool).gt(0) ? fNum('sharePercent', shareOfPool) : <>&mdash;</>
  const chainId = getChainId(chain)

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
    <Card ref={myLiquiditySectionRef} h="fit-content">
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
            groupId="my-liquidity"
          />
        </HStack>
        <Divider />
        <VStack spacing="md" width="full">
          <HStack width="full" justifyContent="space-between">
            <VStack alignItems="flex-start">
              <Heading fontWeight="bold" size="h6">
                {getTitlePrefix()}
              </Heading>
              <Text variant="secondary" fontSize="0.85rem">
                Pool share
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
                {shareofPoolLabel}
              </Text>
            </VStack>
          </HStack>
          <Divider />
          <VStack spacing="md" width="full" alignItems="flex-start" h={`${height - 270}px}`}>
            {activeTab.value === 'aura' && !totalBalanceUsd && pool.staking?.aura ? (
              <HStack w="full" bg="aura.purple" p="2" rounded="md" mb="3xl">
                <Text color="white">Aura APR: {fNum('apr', pool.staking.aura.apr)}</Text>
                <Text color="white" ml="auto">
                  Learn more
                </Text>
                <Link
                  href={getAuraPoolLink(chainId, pool.staking.aura.auraPoolId)}
                  target="_blank"
                  color="white"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </HStack>
            ) : (
              displayTokens.map(token => {
                return (
                  <TokenRow
                    chain={chain}
                    key={`my-liquidity-token-${token.address}`}
                    address={token.address as Address}
                    value={tokenBalanceFor(token.address)}
                    isLoading={isLoadingOnchainUserBalances || isConnecting}
                    abbreviated={false}
                  />
                )
              })
            )}
          </VStack>
          <Divider />
          <HStack mt="md" width="full" justifyContent="flex-start">
            <Button
              onClick={() => router.push(`${pathname}/add-liquidity`)}
              variant="primary"
              flex="1"
              isDisabled={isAddLiquidityBlocked}
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
            {shouldMigrateStake(pool) ? (
              <Tooltip label={migrateStakeTooltipLabel}>
                <Button
                  onClick={() => router.push(`${pathname}/migrate-stake`)}
                  variant="secondary"
                  rightIcon={<InfoOutlineIcon fontSize="sm" />}
                  flex="1"
                >
                  Migrate stake
                </Button>
              </Tooltip>
            ) : (
              <Button
                onClick={() => router.push(`${pathname}/unstake`)}
                variant={hasStakedBalance ? 'tertiary' : 'disabled'}
                isDisabled={!hasStakedBalance}
                flex="1"
              >
                Unstake
              </Button>
            )}
          </HStack>
        </VStack>
      </VStack>
    </Card>
  )
}
