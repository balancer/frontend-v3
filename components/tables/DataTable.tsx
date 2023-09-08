import * as React from 'react'
import { Center, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

export type DataTableProps<Data extends object, Sorting extends SortingState> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
  sorting: Sorting
  setSorting: (sorting: Sorting) => void
  rowClickHandler?: (event: React.MouseEvent<HTMLElement>, rowData: Data) => void
  rowMouseEnterHandler?: (event: React.MouseEvent<HTMLElement>, rowData: Data) => void
}

export function DataTable<Data extends object, Sorting extends SortingState>({
  data,
  columns,
  sorting,
  setSorting,
  rowClickHandler,
}: DataTableProps<Data, Sorting>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: updaterOrValue => {
      setSorting(
        (typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : sorting) as Sorting
      )
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    manualSorting: true,
    sortDescFirst: true,
  })

  return (
    <Table w="full">
      <Thead>
        {table.getHeaderGroups().map(headerGroup => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = header.column.columnDef.meta
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  <HStack justify="end">
                    <Center w="6" h="6">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </Center>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </HStack>
                </Th>
              )
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map(row => (
          <Tr
            key={row.id}
            onClick={event => rowClickHandler && rowClickHandler(event, row.original)}
            style={{ cursor: rowClickHandler ? 'pointer' : 'default' }}
          >
            {row.getVisibleCells().map(cell => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = cell.column.columnDef.meta
              return (
                <Td key={cell.id} isNumeric={meta?.isNumeric}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              )
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
