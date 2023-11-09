import React from 'react'
import { Box, BoxProps, Flex, Spinner } from '@chakra-ui/react'

interface Props<T> extends BoxProps {
  items: T[]
  loading: boolean
  renderTableHeader: () => React.ReactNode
  renderTableRow: (item: T, index: number) => React.ReactNode
}

export function PaginatedTable({
  items,
  loading,
  renderTableRow,
  renderTableHeader,
  ...rest
}: Props<any>) {
  const isLoadingRows = loading && items.length === 0

  return (
    <Box {...rest}>
      {renderTableHeader()}
      <Box
        mb={4}
        borderBottomLeftRadius="md"
        borderBottomRightRadius="md"
        overflow="hidden"
        shadow="lg"
        pr="4"
      >
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
            <Box key={`${item.id}-${index}`}>{renderTableRow(item, index)}</Box>
          ))}
      </Box>
    </Box>
  )
}
