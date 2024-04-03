import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { usePortfolio } from '../usePortfolio'
import { PortfolioTableHeader } from './PortfolioTableHeader'
import { PoolListItem } from '../../pool/pool.types'
import { PortfolioTableRow } from './PortfolioTableRow'
import { HStack, Heading, Stack } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'

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
  gridTemplateColumns: `32px minmax(270px, 1fr) 100px 
  ${furthestLeftColWidth} ${numberColumnWidth} ${numberColumnWidth} 145px`,
  alignItems: 'center',
  gap: { base: 'xxs', xl: 'lg' },
}

export function PortfolioTable() {
  const { portfolioData, isLoadingPortfolio } = usePortfolio()

  const [currentSortingObj, setCurrentSortingObj] = useState<PortfolioSortingData>({
    id: 'staking',
    desc: true,
  })

  const sortedPools = useMemo(() => {
    if (!portfolioData?.pools) return []
    const arr = [...portfolioData.pools]

    return arr.sort((a, b) => {
      if (currentSortingObj.id === 'staking') {
        const aStakedBalance = Number(a.userBalance?.stakedBalance || 0)
        const bStakedBalance = Number(b.userBalance?.stakedBalance || 0)

        return currentSortingObj.desc
          ? bStakedBalance - aStakedBalance
          : aStakedBalance - bStakedBalance
      }

      // To-Do: implement sorting by vebal boost
      if (currentSortingObj.id === 'vebal') {
        return 0
      }

      if (currentSortingObj.id === 'liquidity') {
        const aTotalBalance = a.userBalance?.totalBalanceUsd || 0
        const bTotalBalance = b.userBalance?.totalBalanceUsd || 0

        return currentSortingObj.desc
          ? aTotalBalance - bTotalBalance
          : bTotalBalance - aTotalBalance
      }

      if (currentSortingObj.id === 'apr') {
        const aApr = a.dynamicData.apr.apr as any
        const bApr = b.dynamicData.apr.apr as any

        const aArpValue = aApr.total || aApr.min
        const bArpValue = bApr.total || bApr.min

        return currentSortingObj.desc ? bArpValue - aArpValue : aArpValue - bArpValue
      }

      return 0
    })
  }, [currentSortingObj, portfolioData.pools])

  return (
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
          return <PortfolioTableRow keyValue={index} pool={item} {...rowProps} />
        }}
        showPagination={false}
        paginationProps={null}
        w={{ base: '100vw', lg: 'full' }}
        alignItems="flex-start"
        position="relative"
        left={{ base: '-4px', sm: '0' }}
      />
    </Stack>
  )
}
