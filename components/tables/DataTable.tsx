import * as React from 'react'
import { HStack, Table, Tbody, Td, Th, Thead, Tr, chakra } from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { SortingIcon } from '@/components/icons/SortingIcon'
import { Pagination } from '@/components/pagination/Pagination'

export type DataTableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
  rowClickHandler?: (event: React.MouseEvent<HTMLElement>, rowData: Data) => void
  rowMouseEnterHandler?: (event: React.MouseEvent<HTMLElement>, rowData: Data) => void
  rowCount: number
  onPaginationChangeHandler?: (state: PaginationState) => void
  onSortingChangeHandler?: (state: SortingState) => void
}

export function DataTable<Data extends object>({
  data,
  columns,
  rowClickHandler,
  rowMouseEnterHandler,
  rowCount,
  onPaginationChangeHandler,
  onSortingChangeHandler,
}: DataTableProps<Data>) {
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const [sorting, setSorting] = React.useState<SortingState>([])

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  React.useEffect(() => {
    onPaginationChangeHandler && onPaginationChangeHandler({ pageIndex, pageSize })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize])

  React.useEffect(() => {
    onSortingChangeHandler && onSortingChangeHandler(sorting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    pageCount: Math.ceil(rowCount / pageSize),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualSorting: true,
    enableSortingRemoval: false,
    sortDescFirst: true,
    manualPagination: true,
  })

  return (
    <>
      <Table __css={{ tableLayout: 'fixed', width: 'full' }}>
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta
                return (
                  <Th
                    key={header.id}
                    isNumeric={meta?.isNumeric}
                    onClick={header.column.getToggleSortingHandler()}
                    w={header.getSize()}
                  >
                    <HStack
                      style={
                        header.column.getCanSort() ? { position: 'relative', right: '-20px' } : {}
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <chakra.span h="full" cursor="pointer">
                          {{
                            asc: <SortingIcon direction="asc" />,
                            desc: <SortingIcon direction="desc" />,
                          }[header.column.getIsSorted() as string] ?? <SortingIcon />}
                        </chakra.span>
                      )}
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
              cursor={rowClickHandler ? 'pointer' : 'default'}
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
      {rowCount > pageSize && (
        <Pagination
          goToFirstPage={() => table.setPageIndex(0)}
          gotoLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
          goToNextPage={() => table.nextPage()}
          goToPreviousPage={() => table.previousPage()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          currentPageNumber={table.getState().pagination.pageIndex + 1}
          totalPageCount={table.getPageCount()}
          setPageIndex={table.setPageIndex}
          setPageSize={table.setPageSize}
          pageSize={table.getState().pagination.pageSize}
        />
      )}
    </>
  )
}
