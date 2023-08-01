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
    <VStack>
      <HStack align="center" spacing="sm">
        <Text size="xs">Page num: {pageNum}</Text>

        {[0, 1, 2].map(num => (
          <Button key={num} onClick={() => handlePageChange(num)}>
            {num + 1}
          </Button>
        ))}

        <Button onClick={() => handlePageChange(pageNum + 1)}>Next</Button>
      </HStack>

      <HStack align="center" spacing="sm">
        <Text>No. per page:</Text>

        {[10, 20, 30].map(num => (
          <Button key={num} onClick={() => handleNumPerPageChange(num)}>
            {num}
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}
