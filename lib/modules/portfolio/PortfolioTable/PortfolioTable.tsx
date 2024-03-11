import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { usePortfolio } from '../usePortfolio'
import { PortfolioTableHeader } from './PortfolioTableHeader'
import { PoolListItem } from '../../pool/pool.types'
import { PortfolioTableRow } from './PortfolioTableRow'
import { HStack, Heading, Stack } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

export type PortfolioTableSortingId = 'staking' | 'vebal' | 'liquidity' | 'apr' | 'type'
export interface PortfolioSortingData {
  id: PortfolioTableSortingId
  desc: boolean
}

export const portfolioOrderBy: {
  title: string
  id: PortfolioTableSortingId
}[] = [
  {
    title: 'Type',
    id: 'type',
  },
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
  gridTemplateColumns: `50px minmax(400px, 1fr) 100px 
  ${furthestLeftColWidth} ${numberColumnWidth} ${numberColumnWidth} 145px`,
  alignItems: 'center',
  gap: 'lg',
}

export function PortfolioTable() {
  const { portfolioData, isLoading } = usePortfolio()
  const pools = [portfolioData?.stakedPools || [], portfolioData?.unstakedPools || []].flat()

  const [currentSortingObj, setCurrentSortingObj] = useState<PortfolioSortingData>({
    id: 'staking',
    desc: true,
  })

  // To-Do: don't mutate the original array
  const sortedPools = useMemo(() => {
    return pools.sort((a, b) => {
      if (currentSortingObj.id === 'type') {
        return currentSortingObj.desc ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
      }

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

      // To-Do: implement sorting by APR
      if (currentSortingObj.id === 'apr') {
        return 0
      }

      return 0
    })
  }, [currentSortingObj, pools])

  return (
    <Stack>
      <HStack>
        <Heading size="lg">Balancer portfolio</Heading>
      </HStack>
      <PaginatedTable
        items={sortedPools}
        loading={isLoading}
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
        border="1px solid"
        borderColor="border.base"
        w="full"
        alignItems="flex-start"
      />
    </Stack>
  )
}
