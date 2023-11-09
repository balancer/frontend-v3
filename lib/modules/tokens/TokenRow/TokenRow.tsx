import { Circle, HStack, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'

type Props = {
  address: Address
}

export default function TokenRow({ address }: Props) {
  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <Circle size='32px' bg='red.500' />
        <VStack spacing="0" alignItems="flex-start">
          <Text fontWeight="bold" variant="heading" fontSize="1rem">
            SYM
          </Text>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            Token Symbol
          </Text>
        </VStack>
      </HStack>
      <VStack spacing="0" alignItems="flex-end">
        <Text fontWeight="bold" variant="heading" fontSize="1rem">
          420.69
        </Text>
        <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
          $420.420
        </Text>
      </VStack>
    </HStack>
  )
}
