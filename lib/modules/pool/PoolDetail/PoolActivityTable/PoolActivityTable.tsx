'use client'

import { PaginatedTable } from '@/lib/shared/components/tables/PaginatedTable'
import { PoolActivityTableHeader } from './PoolActivityTableHeader'
import { PoolActivityTableRow } from './PoolActivityTableRow'
import { getPaginationProps } from '@/lib/shared/components/pagination/getPaginationProps'
import { Skeleton } from '@chakra-ui/react'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { usePoolActivity } from '../PoolActivity/usePoolActivity'
import { PoolActivityEl } from '../PoolActivity/poolActivity.types'

export function PoolActivityTable() {
  const isMounted = useIsMounted()
  const { allPoolEvents, pagination, setPagination, isLoading, count } = usePoolActivity()
  const paginationProps = getPaginationProps(count, pagination, setPagination)
  const showPagination = !!allPoolEvents.length && count > pagination.pageSize

  const rowProps = {
    px: { base: 'sm', sm: '0' },
    gridTemplateColumns: `200px 75px 1fr 100px 150px`,
    alignItems: 'center',
    gap: { base: 'xxs', xl: 'lg' },
  }

  if (!isMounted) return <Skeleton height="500px" w="full" />

  return (
    <PaginatedTable
      items={allPoolEvents}
      loading={isLoading}
      renderTableHeader={() => <PoolActivityTableHeader {...rowProps} />}
      renderTableRow={(item: PoolActivityEl, index) => {
        return <PoolActivityTableRow keyValue={index} event={item} {...rowProps} />
      }}
      showPagination={showPagination}
      paginationProps={paginationProps}
      w={{ base: '100vw', lg: 'full' }}
      alignItems="flex-start"
      position="relative"
      left={{ base: '-4px', sm: '0' }}
      noItemsFoundLabel="No pool events found"
    />
  )
}
