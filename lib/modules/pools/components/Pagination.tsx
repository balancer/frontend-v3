'use client'

import { HStack, VStack, Text, Button } from '@chakra-ui/react'

interface Props {
  pageNum: number
  numPerPage: number
  handlePageChange(num: number): void
  handleNumPerPageChange(num: number): void
}

export function Pagination({
  pageNum,
  numPerPage,
  handlePageChange,
  handleNumPerPageChange,
}: Props) {
  return (
    <VStack align="start" spacing="4">
      <HStack align="center" spacing="1">
        <Text size="xs">Page num: {pageNum + 1}</Text>

        {[0, 1, 2].map(num => (
          <Button
            size="sm"
            variant={num === pageNum ? 'solid' : 'outline'}
            key={num}
            onClick={() => handlePageChange(num)}
          >
            {num + 1}
          </Button>
        ))}

        <Button size="sm" onClick={() => handlePageChange(pageNum + 1)}>
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
            onClick={() => handleNumPerPageChange(num)}
          >
            {num}
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}
