import * as React from 'react'
import {
  Text,
  Center,
  Flex,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
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
  rowCount: number
  onPaginationChangeHandler?: (state: PaginationState) => void
}

export function DataTable<Data extends object, Sorting extends SortingState>({
  data,
  columns,
  sorting,
  setSorting,
  rowClickHandler,
  rowMouseEnterHandler,
  rowCount,
  onPaginationChangeHandler,
}: DataTableProps<Data, Sorting>) {
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

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
      pagination,
    },
    pageCount: Math.ceil(rowCount / pageSize),
    onPaginationChange: setPagination,
    manualSorting: true,
    sortDescFirst: true,
    manualPagination: true,
  })

  return (
    <>
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
      {rowCount > pageSize && (
        <Flex justifyContent="space-between" m="4" alignItems="center">
          <Flex>
            <Tooltip label="First Page">
              <IconButton
                aria-label="first page"
                onClick={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
                icon={<ArrowLeftIcon h="3" w="3" />}
                mr="4"
              />
            </Tooltip>
            <Tooltip label="Previous Page">
              <IconButton
                aria-label="previous page"
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
                icon={<ChevronLeftIcon h="6" w="6" />}
              />
            </Tooltip>
          </Flex>
          <Flex alignItems="center">
            <Text flexShrink="0" mr="8">
              Page{' '}
              <Text fontWeight="bold" as="span">
                {table.getState().pagination.pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {table.getPageCount()}
              </Text>
            </Text>
            <Text flexShrink="0">Go to page:</Text>{' '}
            <NumberInput
              ml="2"
              mr="8"
              w="28"
              min={1}
              max={table.getPageCount()}
              onChange={value => {
                const page = value ? parseInt(value) - 1 : 0
                table.setPageIndex(page)
              }}
              defaultValue={table.getState().pagination.pageIndex + 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Select
              w="32"
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label="next page"
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
                icon={<ChevronRightIcon h="6" w="6" />}
              />
            </Tooltip>
            <Tooltip label="Last Page">
              <IconButton
                aria-label="last page"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
                icon={<ArrowRightIcon h="3" w="3" />}
                ml="4"
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </>
  )
}
