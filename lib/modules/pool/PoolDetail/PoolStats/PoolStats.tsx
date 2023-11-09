import React from 'react'
import { Box, Card, HStack, Text, VStack } from '@chakra-ui/react'
import PoolBadges from '../PoolBadges/PoolBadges'

export default function PoolStats() {
  return (
    <Card
      variant="gradient"
      width="full"
      height="320px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Box position="absolute" top="0.75rem" left="0.75rem">
        <PoolBadges />
      </Box>
      <HStack width="full" justifyContent="space-evenly">
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            TVL
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            $192.3k
          </Text>
        </VStack>
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            Volume (24h)
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            $24.8k
          </Text>
        </VStack>
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            Revenue (24h)
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            $1.4k
          </Text>
        </VStack>
        <VStack spacing="0">
          <Text variant="heading" fontWeight="medium">
            APR
          </Text>
          <Text variant="heading" fontWeight="bold" fontSize="2xl">
            3.68%
          </Text>
        </VStack>
      </HStack>
    </Card>
  )
}
