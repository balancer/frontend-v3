import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { usePortfolio } from '../usePortfolio'
import { PortfolioTableHeader } from './PortfolioTableHeader'
import { PoolListItem } from '../../pool/pool.types'
import { PortfolioTableRow } from './PortfolioTableRow'
import { HStack, Heading, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'

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
    title: 'Staking',
    id: 'staking',
  },
  {
    title: 'veBAL boost',
    id: 'vebal',
  },
  {
    title: 'My liquidity',
    id: GqlPoolOrderBy.UserbalanceUsd,
  },
  {
    title: 'APR',
    id: GqlPoolOrderBy.Apr,
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
  const { portfolioData, isLoadingPortfolio, setOrderBy, setOrderDirection } = usePortfolio()

  const [currentSortingObj, setCurrentSortingObj] = useState<PortfolioSortingData>({
    id: 'staking',
    desc: true,
  })

  function setSort(data: PortfolioSortingData) {
    setCurrentSortingObj(data)
    // console.log('setSort', data)
    // setOrderBy(data.id)
    // setOrderDirection(data.desc ? 'desc' : 'asc')
  }

  return (
    <Stack gap={5}>
      <HStack>
        <Heading size="lg">Balancer portfolio</Heading>
      </HStack>
      <PaginatedTable
        items={portfolioData?.pools || []}
        loading={isLoadingPortfolio}
        renderTableHeader={() => (
          <PortfolioTableHeader
            currentSortingObj={currentSortingObj}
            setCurrentSortingObj={setSort}
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
