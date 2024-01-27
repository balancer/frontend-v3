'use client'

import { Box } from '@chakra-ui/react'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { PoolListTableHeader } from './PoolListTableHeader'
import { PoolListTableRow } from './PoolListTableRow'
import { getPaginationProps } from '@/lib/shared/components/pagination/getPaginationProps'
import { PoolListItem } from '../../pool.types'

interface Props {
  pools: PoolListItem[]
  count: number
  loading: boolean
}

export function PoolListTable({ pools, count, loading }: Props) {
  const { pagination, setPagination, userAddress } = usePoolListQueryState()
  const paginationProps = getPaginationProps(count || 0, pagination, setPagination)
  const showPagination = !!pools.length && !!count && count > pagination.pageSize

  const numberColumnWidth = userAddress ? '150px' : '175px'
  const furthestLeftColWidth = '120px'

  const rowProps = {
    px: [0, 4],
    gridTemplateColumns: `50px minmax(400px, 1fr) ${userAddress ? furthestLeftColWidth : ''} ${
      userAddress ? numberColumnWidth : furthestLeftColWidth
    } ${numberColumnWidth} 200px`,
    alignItems: 'center',
    gap: 'lg',
    minW: '800px',
  }

  return (
    <Box w="full" style={{ position: 'relative' }}>
      <PaginatedTable
        items={pools}
        loading={loading}
        renderTableHeader={() => <PoolListTableHeader {...rowProps} />}
        renderTableRow={(item: PoolListItem, index) => {
          return <PoolListTableRow keyValue={index} pool={item} {...rowProps} />
        }}
        showPagination={showPagination}
        paginationProps={paginationProps}
        border="1px solid"
        borderColor="border.base"
        w="full"
        alignItems="flex-start"
      />
      {loading && (
        <Box
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'black',
            top: 0,
            left: 0,
            opacity: 0.3,
            borderRadius: 10,
          }}
        ></Box>
      )}
    </Box>
  )
}
