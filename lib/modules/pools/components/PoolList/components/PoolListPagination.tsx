'use client'

import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { usePoolList } from '@/lib/modules/pools/hooks/usePoolList'

export function PoolListPagination() {
  const { pageNumber, pageSize, setPageNumber, setPageSize } = usePoolList()

  return (
    <VStack align="start" spacing="md">
      <HStack align="center" spacing="1">
        <Text size="xs">Page num: {pageNumber + 1}</Text>

        {[0, 1, 2].map(num => (
          <Button
            size="sm"
            variant={num === pageNumber ? 'solid' : 'outline'}
            key={num}
            onClick={() => setPageNumber(num)}
          >
            {num + 1}
          </Button>
        ))}

        <Button size="sm" onClick={() => setPageNumber(pageNumber + 1)}>
          Next
        </Button>
      </HStack>

      <HStack align="center" spacing="1">
        <Text>No. per page:</Text>

        {[10, 20, 30].map(num => (
          <Button
            size="sm"
            variant={num === pageSize ? 'solid' : 'outline'}
            key={num}
            onClick={() => setPageSize(num)}
          >
            {num}
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}
