'use client'

import { Box } from '@chakra-ui/react'
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { usePoolListQueryState } from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { PoolListTableHeader } from './PoolListTableHeader'
import { PoolListTableRow } from './PoolListTableRow'
import { getPaginationProps } from '@/lib/shared/components/pagination/getPaginationProps'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'

const rowProps = {
  px: [0, 4],
  gridTemplateColumns: '50px 1fr 150px 175px 175px',
  alignItems: 'center',
  gap: 0,
  minW: '800px',
}

export function PoolListTable() {
  const { pools, loading, count } = usePoolList()
  const { pagination, setPagination } = usePoolListQueryState()
  const paginationProps = getPaginationProps(count || 0, pagination, setPagination)
  const showPagination = !!pools.length && !!count && count > pagination.pageSize
  const { isMobile } = useBreakpoints()

  return (
    <Box w="full" style={{ position: 'relative' }}>
      <PaginatedTable
        items={pools}
        loading={loading}
        renderTableHeader={() => <PoolListTableHeader {...rowProps} />}
        renderTableRow={(item: any, index) => {
          return <PoolListTableRow key={index} pool={item} {...rowProps} />
        }}
        showPagination={showPagination}
        paginationProps={paginationProps}
        border="1px solid"
        borderColor="gray.100"
        borderRadius="16px"
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
