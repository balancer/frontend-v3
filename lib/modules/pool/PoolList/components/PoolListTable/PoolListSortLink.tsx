import { ButtonProps, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface Props extends ButtonProps {
  title: string
  isDesc: boolean
  isCurrentSort: boolean
}

const getColor = (isCurrentSort: boolean) => (isCurrentSort ? 'blue' : 'lightgrey')

export default function PoolListSortLink({ title, isDesc, isCurrentSort, ...rest }: Props) {
  return (
    <Button
      _hover={{ backgroundColor: isCurrentSort ? 'lightblue' : 'transparent' }}
      bgColor={isCurrentSort ? 'lightblue' : undefined}
      p={isCurrentSort ? '2' : '0'}
      pr="2"
      height="fit-content"
      variant="ghost"
      userSelect="none"
      borderRadius="2xl"
      {...rest}
    >
      <HStack>
        <Text>{title}</Text>
        <VStack alignContent="center" gap="0">
          {(!isCurrentSort || !isDesc) && <FiChevronUp size="15" color={getColor(isCurrentSort)} />}
          {(!isCurrentSort || isDesc) && (
            <FiChevronDown size="15" color={getColor(isCurrentSort)} />
          )}
        </VStack>
      </HStack>
    </Button>
  )
}
