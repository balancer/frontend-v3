'use client'

import { Divider, Grid, GridItem, Text } from '@chakra-ui/react'
import { usePoolActivity } from '../PoolActivity/usePoolActivity'
import { Sorting, SortingBy } from '../PoolActivity/poolActivity.types'
import { SortableHeader } from '@/lib/shared/components/tables/SortableHeader'

export function PoolActivityTableHeader({ ...rest }) {
  const {
    setSortingBy,
    isSortedByTime,
    isSortedByValue,
    toggleSorting,
    setSorting,
    sortingBy,
    sorting,
    isSortedByAction,
  } = usePoolActivity()

  const handleSort = (newSortingBy: SortingBy) => {
    if (sortingBy === newSortingBy) {
      toggleSorting()
    } else {
      setSortingBy(newSortingBy)
      setSorting(Sorting.asc)
    }
  }

  return (
    <>
      <Divider />
      <Grid {...rest} p={['ms', 'md']} w="full">
        <GridItem>
          <Text fontWeight="bold">User</Text>
        </GridItem>
        <SortableHeader
          label="Action"
          isSorted={isSortedByAction}
          sorting={sorting}
          onSort={handleSort}
        />
        <GridItem>
          <Text fontWeight="bold">Transaction Details</Text>
        </GridItem>
        <SortableHeader
          label="Value"
          isSorted={isSortedByValue}
          sorting={sorting}
          onSort={handleSort}
          align="right"
        />
        <SortableHeader
          label="Time"
          isSorted={isSortedByTime}
          sorting={sorting}
          onSort={handleSort}
          align="right"
        />
      </Grid>
      <Divider />
    </>
  )
}
