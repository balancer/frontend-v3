import { ButtonProps, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface Props extends ButtonProps {
  title: string
  orderDirection: 'asc' | 'desc'
  isCurrentSort: boolean
}

const getColor = (
  isCurrentSort: boolean,
  orderDirection: 'asc' | 'desc',
  isChevronDown: boolean
) => {
  if (
    isCurrentSort &&
    ((orderDirection === 'desc' && isChevronDown) || (orderDirection === 'asc' && !isChevronDown))
  ) {
    return 'blue'
  } else {
    return 'lightgrey'
  }
}

export default function PoolListSortLink({ title, orderDirection, isCurrentSort, ...rest }: Props) {
  return (
    <Button
      _hover={{ backgroundColor: 'transparent', color: 'beets.highlight' }}
      padding="0"
      height="fit-content"
      variant="ghost"
      userSelect="none"
      {...rest}
    >
      <HStack>
        <Text>{title}</Text>
        <VStack alignContent="center" gap="0">
          <FiChevronUp size="15" color={getColor(isCurrentSort, orderDirection, false)} />
          <FiChevronDown size="15" color={getColor(isCurrentSort, orderDirection, true)} />
        </VStack>
      </HStack>
    </Button>
  )
}
