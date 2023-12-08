'use client'

import { Box } from '@chakra-ui/react'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { PoolListTableHeader } from './PoolListTableHeader'
import { PoolListTableRow } from './PoolListTableRow'
import { getPaginationProps } from '@/lib/shared/components/pagination/getPaginationProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { DecoratedPoolListItem } from '../../pool.types'

interface Props {
  pools: DecoratedPoolListItem[]
  count: number
  loading: boolean
}

export function PoolListTable({ pools, count, loading }: Props) {
  const { pagination, setPagination, userAddress } = usePoolListQueryState()
  const paginationProps = getPaginationProps(count || 0, pagination, setPagination)
  const showPagination = !!pools.length && !!count && count > pagination.pageSize
  const { isMobile } = useBreakpoints()

  const rowProps = {
    px: [0, 4],
    gridTemplateColumns: `50px 1fr ${userAddress ? '150px' : ''} 175px 175px 175px`,
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
        renderTableRow={(item: DecoratedPoolListItem, index) => {
          return <PoolListTableRow keyValue={index} pool={item} {...rowProps} />
        }}
        showPagination={showPagination}
        paginationProps={paginationProps}
        overflowX={isMobile ? 'auto' : 'hidden'}
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
