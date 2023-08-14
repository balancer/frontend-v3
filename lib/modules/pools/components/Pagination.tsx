'use client'

import { HStack, VStack, Text, Button } from '@chakra-ui/react'
import { usePools } from '../hooks/usePools'

export function Pagination() {
  const { pageNum, setPageNum, numPerPage, setNumPerPage } = usePools()

  return (
    <VStack align="start" spacing="md">
      <HStack align="center" spacing="1">
        <Text size="xs">Page num: {pageNum + 1}</Text>

        {[0, 1, 2].map(num => (
          <Button
            size="sm"
            variant={num === pageNum ? 'solid' : 'outline'}
            key={num}
            onClick={() => setPageNum(num)}
          >
            {num + 1}
          </Button>
        ))}

        <Button size="sm" onClick={() => setPageNum(pageNum + 1)}>
          Next
        </Button>
      </HStack>

      <HStack align="center" spacing="1">
        <Text>No. per page:</Text>

        {[10, 20, 30].map(num => (
          <Button
            size="sm"
            variant={num === numPerPage ? 'solid' : 'outline'}
            key={num}
            onClick={() => setNumPerPage(num)}
          >
            {num}
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}
