import * as React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, HStack, Center } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  OnChangeFn,
} from '@tanstack/react-table'

export type DataTableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
  sorting: SortingState
  setSorting: OnChangeFn<SortingState>
  rowClickHandler?: (event: React.MouseEvent<HTMLElement>, rowData: Data) => void
  rowMouseEnterHandler?: (event: React.MouseEvent<HTMLElement>, rowData: Data) => void
}

export function DataTable<Data extends object>({
  data,
  columns,
  sorting,
  setSorting,
  rowClickHandler,
  rowMouseEnterHandler,
}: DataTableProps<Data>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
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
            onMouseEnter={event =>
              rowMouseEnterHandler && rowMouseEnterHandler(event, row.original)
            }
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
