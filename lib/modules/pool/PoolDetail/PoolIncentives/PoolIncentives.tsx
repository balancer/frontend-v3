import { Box, Card, HStack, Text } from '@chakra-ui/react'
import React from 'react'

export default function PoolIncentives() {
  return (
    <Card variant='gradient' width="full" height="320px">
      <HStack p='5'>
        <Text variant='heading' fontWeight="bold" as="h2" fontSize="xl">
          Incentives
        </Text>
      </HStack>
    </Card>
  )
}
