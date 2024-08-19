'use client'

import { Grid, GridItem, Text } from '@chakra-ui/react'
import { usePoolActivity } from '../PoolActivity/usePoolActivity'
import { Sorting, SortingBy } from '../PoolActivity/poolActivity.types'

type SortableHeaderProps = {
  label: string
  sortingBy: string
  isSorted: boolean
  sorting: Sorting
  onSort: (newSortingBy: SortingBy) => void
  align?: 'left' | 'right'
}

function SortableHeader({
  label,
  sortingBy,
  isSorted,
  onSort,
  sorting,
  align = 'left',
}: SortableHeaderProps) {
  const renderSortIcon = () => {
    if (sortingBy !== label.toLowerCase()) return '↑↓'
    return sorting === Sorting.asc ? '↑' : '↓'
  }

  const color = isSorted ? 'green' : 'font.primary'

  return (
    <GridItem textAlign="right">
      <Text
        display="flex"
        justifyContent={align === 'left' ? 'flex-start' : 'flex-end'}
        alignItems="center"
        fontWeight="bold"
        color={color}
        cursor="pointer"
        onClick={() => onSort(label.toLowerCase() as SortingBy)}
      >
        {label}
        <Text fontSize="xs" ml={1} color={color}>
          {renderSortIcon()}
        </Text>
      </Text>
    </GridItem>
  )
}

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
    <Grid {...rest} p={['ms', 'md']} w="full" borderBottom="1px solid" borderColor="border.base">
      <GridItem>
        <Text fontWeight="bold">User</Text>
      </GridItem>
      <SortableHeader
        label="Action"
        sortingBy={sortingBy}
        isSorted={isSortedByAction}
        sorting={sorting}
        onSort={handleSort}
      />
      <GridItem>
        <Text fontWeight="bold">Transaction Details</Text>
      </GridItem>
      <SortableHeader
        label="Value"
        sortingBy={sortingBy}
        isSorted={isSortedByValue}
        sorting={sorting}
        onSort={handleSort}
        align="right"
      />
      <SortableHeader
        label="Time"
        sortingBy={sortingBy}
        isSorted={isSortedByTime}
        sorting={sorting}
        onSort={handleSort}
        align="right"
      />
    </Grid>
  )
}
