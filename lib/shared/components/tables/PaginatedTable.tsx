import React from 'react'
import { Box, BoxProps, Flex, Spinner, VStack } from '@chakra-ui/react'
import { Pagination } from '@/lib/shared/components/pagination/Pagination'

interface Props<T> extends BoxProps {
  items: T[]
  loading: boolean
  renderTableHeader: () => React.ReactNode
  renderTableRow: (item: T, index: number) => React.ReactNode
  showPagination: boolean
  paginationProps: any // TODO: type this
}

export function PaginatedTable({
  items,
  loading,
  renderTableRow,
  renderTableHeader,
  showPagination,
  paginationProps,
  ...rest
}: Props<any>) {
  const isLoadingRows = loading && items.length === 0

  return (
    <>
      <VStack {...rest}>
        {renderTableHeader()}
        {isLoadingRows && (
          <Flex justifyContent={'center'} py={32}>
            <Spinner size="xl" />
          </Flex>
        )}
        {!isLoadingRows && items.length === 0 && (
          <Box height="md" display="flex" alignItems="center" justifyContent="center">
            No results found for your search criteria.
          </Box>
        )}
        {!isLoadingRows &&
          items.map((item, index) => (
            <Box key={`${item.id}-${index}`} w="full">
              {renderTableRow(item, index)}
            </Box>
          ))}
      </VStack>
      {showPagination && <Pagination {...paginationProps} />}
    </>
  )
}
