import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { usePortfolio } from '../usePortfolio'
import { PortfolioTableHeader } from './PortfolioTableHeader'
import { PoolListItem } from '../../pool/pool.types'
import { PortfolioTableRow } from './PortfolioTableRow'
import { useUserAccount } from '../../web3/useUserAccount'
import { HStack, Heading, Stack } from '@chakra-ui/react'

export function PortfolioTable() {
  const { portfolioData, isLoading } = usePortfolio()
  const { userAddress } = useUserAccount()
  const pools = [portfolioData?.stakedPools || [], portfolioData?.unstakedPools || []].flat()

  const numberColumnWidth = userAddress ? '150px' : '175px'
  const furthestLeftColWidth = '120px'

  const rowProps = {
    px: [0, 4],
    gridTemplateColumns: `50px minmax(400px, 1fr) 100px ${
      userAddress ? furthestLeftColWidth : ''
    } ${userAddress ? numberColumnWidth : furthestLeftColWidth} ${numberColumnWidth} 200px`,
    alignItems: 'center',
    gap: 'lg',
  }

  return (
    <Stack>
      <HStack>
        <Heading size="xl">Balancer portfolio</Heading>
      </HStack>
      <PaginatedTable
        items={pools}
        loading={isLoading}
        renderTableHeader={() => <PortfolioTableHeader {...rowProps} />}
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
