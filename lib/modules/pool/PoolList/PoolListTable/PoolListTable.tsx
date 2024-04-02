'use client'

import { usePoolListQueryState } from '../usePoolListQueryState'
import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { PoolListTableHeader } from './PoolListTableHeader'
import { PoolListTableRow } from './PoolListTableRow'
import { getPaginationProps } from '@/lib/shared/components/pagination/getPaginationProps'
import { PoolListItem } from '../../pool.types'
import { Skeleton } from '@chakra-ui/react'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'

interface Props {
  pools: PoolListItem[]
  count: number
  loading: boolean
}

export function PoolListTable({ pools, count, loading }: Props) {
  const isMounted = useIsMounted()
  const { pagination, setPagination, userAddress } = usePoolListQueryState()
  const paginationProps = getPaginationProps(count || 0, pagination, setPagination)
  const showPagination = !!pools.length && !!count && count > pagination.pageSize

  const numberColumnWidth = userAddress ? '150px' : '175px'
  const furthestLeftColWidth = '120px'

  const rowProps = {
    px: [3, 0],
    gridTemplateColumns: `32px minmax(276px, 1fr) 100px ${
      userAddress ? furthestLeftColWidth : ''
    } ${userAddress ? numberColumnWidth : furthestLeftColWidth} ${numberColumnWidth} 200px`,
    alignItems: 'center',
    gap: { base: 'xs', xl: 'lg' },
  }

  if (!isMounted) return <Skeleton height="500px" w="full" />

  return (
    <PaginatedTable
      items={pools}
      loading={loading}
      renderTableHeader={() => <PoolListTableHeader {...rowProps} />}
      renderTableRow={(item: PoolListItem, index) => {
        return <PoolListTableRow keyValue={index} pool={item} {...rowProps} />
      }}
      showPagination={showPagination}
      paginationProps={paginationProps}
      w={{ base: '100vw', lg: 'full' }}
      alignItems="flex-start"
      position="relative"
      left={{ base: '-6px', sm: '0' }}
    />
  )
}
