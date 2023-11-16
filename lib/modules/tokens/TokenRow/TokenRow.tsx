import { Circle, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'

type Props = {
  address: Address
}

export default function TokenRow({ address }: Props) {
  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <Circle size="32px" bg="red.500" />
        <VStack spacing="0" alignItems="flex-start">
          <Heading fontWeight="bold" as="h6" fontSize="1rem">
            {address}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            Token Symbol
          </Text>
        </VStack>
      </HStack>
      <VStack spacing="0" alignItems="flex-end">
        <Heading fontWeight="bold" as="h6" fontSize="1rem">
          420.69
        </Heading>
        <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
          $420.420
        </Text>
      </VStack>
    </HStack>
  )
}
