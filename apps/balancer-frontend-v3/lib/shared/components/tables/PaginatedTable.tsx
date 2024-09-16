import React from 'react'
import { Box, BoxProps, Center, Text, Spinner, VStack, Skeleton } from '@chakra-ui/react'
import { Pagination } from '@/lib/shared/components/pagination/Pagination'

interface Props<T> extends BoxProps {
  items: T[]
  loading: boolean
  renderTableHeader: () => React.ReactNode
  renderTableRow: (item: T, index: number) => React.ReactNode
  showPagination: boolean
  paginationProps: any // TODO: type this
  noItemsFoundLabel: string
}

export function PaginatedTable({
  items,
  loading,
  renderTableRow,
  renderTableHeader,
  showPagination,
  paginationProps,
  noItemsFoundLabel,
}: Props<any>) {
  return (
    <>
      <VStack className="hide-scrollbar" overflowX="scroll" w="full">
        {renderTableHeader()}
        <Box position="relative" w="full">
          {items.length > 0 && (
            <VStack gap="0">
              {items.map((item, index) => (
                <Box key={`${item.id}-${index}`} w="full">
                  {renderTableRow(item, index)}
                </Box>
              ))}
            </VStack>
          )}
          {!loading && items.length === 0 && (
            <Center py="2xl">
              <Text color="font.secondary">{noItemsFoundLabel}</Text>
            </Center>
          )}
          {loading && items.length === 0
            ? Array.from({ length: 20 }).map((_, index) => (
                <Box key={index} py="xs" w="full">
                  <Skeleton height="68px" w="full" />
                </Box>
              ))
            : null}
          {loading && items.length > 0 ? (
            <Box>
              <Box
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  borderRadius: 10,
                  zIndex: 10,
                  backdropFilter: 'blur(3px)',
                }}
              >
                <Center py="4xl">
                  <Spinner size="xl" />
                </Center>
              </Box>
            </Box>
          ) : null}
        </Box>
      </VStack>
      {showPagination ? <Pagination p="md" {...paginationProps} /> : null}
    </>
  )
}
