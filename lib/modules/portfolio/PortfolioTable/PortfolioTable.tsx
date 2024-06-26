import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { usePortfolio } from '../PortfolioProvider'
import { PortfolioTableHeader } from './PortfolioTableHeader'
import { PoolListItem } from '../../pool/pool.types'
import { PortfolioTableRow } from './PortfolioTableRow'
import { Checkbox, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { useVebalBoost } from '../../vebal/useVebalBoost'
import { Pool } from '../../pool/PoolProvider'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import {
  calcTotalStakedBalance,
  getUserTotalBalanceUsd,
  hasAuraStakedBalance,
  hasBalancerStakedBalance,
  hasTinyBalance,
} from '../../pool/user-balance.helpers'
import { bn } from '@/lib/shared/utils/numbers'
import { getTotalApr } from '../../pool/pool.utils'

export type PortfolioTableSortingId = 'staking' | 'vebal' | 'liquidity' | 'apr'
export interface PortfolioSortingData {
  id: PortfolioTableSortingId | GqlPoolOrderBy
  desc: boolean
}

export const portfolioOrderBy: {
  title: string
  id: PortfolioTableSortingId
}[] = [
  {
    title: 'Staking',
    id: 'staking',
  },
  {
    title: 'veBAL boost',
    id: 'vebal',
  },
  {
    title: 'My liquidity',
    id: 'liquidity',
  },
  {
    title: 'APR',
    id: 'apr',
  },
]

const numberColumnWidth = '125px'
const furthestLeftColWidth = '140px'

const rowProps = {
  px: [0, 4],
  gridTemplateColumns: `32px minmax(320px, 1fr) 100px
  ${furthestLeftColWidth} ${numberColumnWidth} ${numberColumnWidth} 145px`,
  alignItems: 'center',
  gap: { base: 'xxs', xl: 'lg' },
}

const generateStakingWeightForSort = (pool: Pool) => {
  return (
    Number(bn(calcTotalStakedBalance(pool)).isGreaterThan(0)) +
    Number(hasBalancerStakedBalance(pool)) +
    Number(hasAuraStakedBalance(pool)) * 2
  )
}

export function PortfolioTable() {
  const [shouldFilterTinyBalances, setShouldFilterTinyBalances] = useState(true)
  const { portfolioData, isLoadingPortfolio } = usePortfolio()

  // Filter out pools with tiny balances (<0.01 USD)
  const minUsdBalance = 0.01
  const filteredBalancePools = shouldFilterTinyBalances
    ? portfolioData.pools.filter(pool => !hasTinyBalance(pool, minUsdBalance))
    : portfolioData.pools

  const hasTinyBalances = portfolioData.pools.some(pool => hasTinyBalance(pool, minUsdBalance))

  const { veBalBoostMap } = useVebalBoost(portfolioData.stakedPools)

  const [currentSortingObj, setCurrentSortingObj] = useState<PortfolioSortingData>({
    id: 'staking',
    desc: true,
  })

  const sortedPools = useMemo(() => {
    if (!portfolioData?.pools) return []
    const arr = [...filteredBalancePools]

    return arr.sort((a, b) => {
      if (currentSortingObj.id === 'staking') {
        const aStakingWeight = generateStakingWeightForSort(a)
        const bStakingWeight = generateStakingWeightForSort(b)

        return currentSortingObj.desc
          ? bStakingWeight - aStakingWeight
          : aStakingWeight - bStakingWeight
      }

      if (currentSortingObj.id === 'vebal') {
        const aVebalBoost = Number(veBalBoostMap?.[a.id] || 0)
        const bVebalBoost = Number(veBalBoostMap?.[b.id] || 0)
        return currentSortingObj.desc ? bVebalBoost - aVebalBoost : aVebalBoost - bVebalBoost
      }

      if (currentSortingObj.id === 'liquidity') {
        const aTotalBalance = getUserTotalBalanceUsd(a)
        const bTotalBalance = getUserTotalBalanceUsd(b)

        return currentSortingObj.desc
          ? bTotalBalance - aTotalBalance
          : aTotalBalance - bTotalBalance
      }

      if (currentSortingObj.id === 'apr') {
        const [aApr] = getTotalApr(a.dynamicData.aprItems)
        const [bApr] = getTotalApr(b.dynamicData.aprItems)

        return currentSortingObj.desc ? bApr.minus(aApr).toNumber() : aApr.minus(bApr).toNumber()
      }

      return 0
    })
  }, [
    portfolioData?.pools,
    filteredBalancePools,
    currentSortingObj.id,
    currentSortingObj.desc,
    veBalBoostMap,
  ])

  return (
    <FadeInOnView>
      <Stack gap={5}>
        <HStack>
          <Heading size="lg">Balancer portfolio</Heading>
        </HStack>
        <PaginatedTable
          items={sortedPools}
          loading={isLoadingPortfolio}
          renderTableHeader={() => (
            <PortfolioTableHeader
              currentSortingObj={currentSortingObj}
              setCurrentSortingObj={setCurrentSortingObj}
              {...rowProps}
            />
          )}
          renderTableRow={(item: PoolListItem, index) => {
            return (
              <PortfolioTableRow
                keyValue={index}
                pool={item}
                veBalBoostMap={veBalBoostMap}
                {...rowProps}
              />
            )
          }}
          showPagination={false}
          paginationProps={null}
          w={{ base: '100vw', lg: 'full' }}
          alignItems="flex-start"
          position="relative"
          left={{ base: '-4px', sm: '0' }}
        />
        {hasTinyBalances && (
          <Checkbox
            size="lg"
            isChecked={shouldFilterTinyBalances}
            onChange={() => {
              setShouldFilterTinyBalances(!shouldFilterTinyBalances)
            }}
          >
            <Text variant="secondary" fontSize="md">
              Hide pools under $0.01
            </Text>
          </Checkbox>
        )}
      </Stack>
    </FadeInOnView>
  )
}
