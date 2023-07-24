'use client'
import { Button } from '@/components/_base/Button'
import { Text } from '@/components/_base/Text'
import { HStack } from '@/components/_base/HStack'
import { VStack } from '@/components/_base/VStack'

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
    <VStack spacing="sm">
      <HStack align="center" spacing="sm">
        <Text size="xs">Page num: {pageNum}</Text>

        {[0, 1, 2].map(num => (
          <Button
            variant={pageNum === num ? 'primary' : 'outline'}
            size="xs"
            shape="square"
            key={num}
            onClick={() => handlePageChange(num)}
          >
            {num + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="xs"
          onClick={() => handlePageChange(pageNum + 1)}
        >
          Next
        </Button>
      </HStack>

      <HStack align="center" spacing="sm">
        <Text size="xs">No. per page:</Text>

        {[10, 20, 30].map(num => (
          <Button
            variant={numPerPage === num ? 'primary' : 'outline'}
            key={num}
            size="xs"
            shape="square"
            onClick={() => handleNumPerPageChange(num)}
          >
            {num}
          </Button>
        ))}
      </HStack>
    </VStack>
  )
}
