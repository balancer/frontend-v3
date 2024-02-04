import { ButtonProps, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface Props extends ButtonProps {
  title: string
  isDesc: boolean
  isCurrentSort: boolean
}

const getColor = (isCurrentSort: boolean) => (isCurrentSort ? 'text.special' : 'default') // TODO: text.special doesn't work

export default function PoolListSortButton({ title, isDesc, isCurrentSort, ...rest }: Props) {
  return (
    <Button size="sm" variant={isCurrentSort ? 'tertiary' : 'ghost'} {...rest}>
      <HStack>
        <Text>{title}</Text>
        <VStack alignContent="center" gap="0" spacing="0">
          {(!isCurrentSort || !isDesc) && <FiChevronUp size="10" color={getColor(isCurrentSort)} />}
          {(!isCurrentSort || isDesc) && (
            <FiChevronDown size="10" color={getColor(isCurrentSort)} />
          )}
        </VStack>
      </HStack>
    </Button>
  )
}
