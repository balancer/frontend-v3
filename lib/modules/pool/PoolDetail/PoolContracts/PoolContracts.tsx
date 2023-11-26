import { Card, Heading, VStack } from '@chakra-ui/react'

export function PoolContracts() {
  return (
    <Card minHeight="175px" width="full" variant="level3" px="6" py="5">
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool contracts
        </Heading>
      </VStack>
    </Card>
  )
}
