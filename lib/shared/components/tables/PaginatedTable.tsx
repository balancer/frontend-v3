import React from 'react'
import { Box, BoxProps, Card, Center, Text, Spinner, VStack } from '@chakra-ui/react'
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
  return (
    <Card variant="level1" p="md" shadow="xl" {...rest}>
      <VStack spacing="md" w="full" overflowX="scroll" className="hide-scrollbar">
        {renderTableHeader()}
        <Box w="full" position="relative">
          {items.length > 0 && (
            <VStack spacing="md">
              {items.map((item, index) => (
                <Box key={`${item.id}-${index}`} w="full">
                  {renderTableRow(item, index)}
                </Box>
              ))}
            </VStack>
          )}

          {!loading && items.length === 0 && (
            <Center py="2xl">
              <Text color="font.secondary">No pools found</Text>
            </Center>
          )}

          {loading && items.length === 0 && (
            <Center py="2xl">
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
                <Center>
                  <Spinner size="xl" />
                </Center>
              </Box>
            </Center>
          )}

          {loading && (
            <Box py="2xl">
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
          )}
        </Box>
      </VStack>
      {showPagination && <Pagination p="md" {...paginationProps} />}
    </Card>
  )
}
