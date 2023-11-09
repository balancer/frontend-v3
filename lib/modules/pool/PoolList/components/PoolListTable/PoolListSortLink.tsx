import { Flex, ButtonProps, Text, Button } from '@chakra-ui/react'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'

interface Props extends ButtonProps {
  title: string
  orderDirection: boolean
}

export default function PoolListSortLink({ title, orderDirection, ...rest }: Props) {
  return (
    <Button
      _hover={{ backgroundColor: 'transparent', color: 'beets.highlight' }}
      _focus={{ outline: 'none' }}
      _active={{ backgroundColor: 'transparent' }}
      padding="0"
      height="fit-content"
      variant="ghost"
      color={orderDirection ? 'beets.green' : 'beets.base.100'}
      {...rest}
      userSelect="none"
    >
      <Flex justifyContent="flex-end" alignItems="center">
        <Text fontSize="md" fontWeight="semibold">
          {title}
        </Text>
        {orderDirection ? <FiArrowDown size={20} /> : <FiArrowUp size={20} />}
      </Flex>
    </Button>
  )
}
