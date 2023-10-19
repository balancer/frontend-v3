import { Grid } from '@chakra-ui/react'
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolListCard } from './PoolListCard'
import { Pagination } from '@/components/pagination/Pagination'
import { usePoolListQueryState } from '../../usePoolListQueryState'
import { PaginationHelpers } from '@/components/pagination/PaginationHelpers'

export function PoolListGrid() {
  const { pools, count } = usePoolList()
  const { pagination, setPagination } = usePoolListQueryState()
  const {
    totalPageCount,
    canPreviousPage,
    canNextPage,
    currentPageNumber,
    pageSize,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    setPageIndex,
    setPageSize,
  } = PaginationHelpers(count || 0, pagination, setPagination)

  return (
    <>
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }} w="full" gap="4">
        {pools.map(pool => (
          <PoolListCard key={pool.id} pool={pool} />
        ))}
      </Grid>
      {pools.length && count && count > pagination.pageSize && (
        <Pagination
          goToFirstPage={goToFirstPage}
          gotoLastPage={goToLastPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          currentPageNumber={currentPageNumber}
          totalPageCount={totalPageCount}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          pageSize={pageSize}
        />
      )}
    </>
  )
}
