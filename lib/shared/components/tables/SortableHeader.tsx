import { Box, GridItem, HStack, Text } from '@chakra-ui/react'
import { SortableIcon } from '../icons/SortableIcon'
import { ArrowDownIcon } from '../icons/ArrowDownIcon'
import { ArrowUpIcon } from '../icons/ArrowUpIcon'

type SortableHeaderProps = {
  label: string
  isSorted: boolean
  sorting: 'asc' | 'desc'
  onSort: (newSortingBy: any) => void
  align?: 'left' | 'right'
}

export function SortableHeader({
  label,
  isSorted,
  onSort,
  sorting,
  align = 'left',
}: SortableHeaderProps) {
  const renderSortIcon = () => {
    return (
      <HStack gap="0" w="20px">
        {!isSorted ? (
          <>
            <SortableIcon />
          </>
        ) : (
          <Box as="span">{sorting === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}</Box>
        )}
      </HStack>
    )
  }

  const color = isSorted ? 'font.highlight' : 'font.primary'

  return (
    <GridItem>
      <HStack
        gap="0"
        justifyContent={align === 'left' ? 'flex-start' : 'flex-end'}
        alignItems="center"
      >
        <Text
          fontWeight="bold"
          color={color}
          cursor="pointer"
          onClick={() => onSort(label.toLowerCase())}
        >
          {label}
        </Text>
        <Box fontSize="xs" ml={1} color={color}>
          {renderSortIcon()}
        </Box>
      </HStack>
    </GridItem>
  )
}
