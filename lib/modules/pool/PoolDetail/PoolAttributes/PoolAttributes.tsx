'use client'

import { Box, Show, Card, Stack, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { useFormattedPoolAttributes } from './useFormattedPoolAttributes'

export function PoolAttributes() {
  const formattedAttributes = useFormattedPoolAttributes()

  return (
    <Card minHeight="320px" minW="50%">
      <VStack alignItems="flex-start" spacing={{ base: 'ms', md: 'md' }} width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool attributes
        </Heading>

        <VStack width="full">
          <Show above="md">
            <HStack spacing={{ base: '0', md: '8' }} width="full">
              <Box minWidth="140px">
                <Heading variant="h6" fontSize="1rem">
                  Attribute
                </Heading>
              </Box>
              <Heading variant="h6" fontSize="1rem">
                Details
              </Heading>
            </HStack>
          </Show>
          {formattedAttributes.map(attribute => {
            return (
              attribute && (
                <Stack
                  width="full"
                  spacing={{ base: '0.5', md: '8' }}
                  key={`pool-attribute-${attribute.title}`}
                  direction={{ base: 'column', md: 'row' }}
                >
                  <Box minWidth="140px">
                    <Text fontSize="sm" variant={{ base: 'primary', md: 'secondary' }}>
                      {attribute.title}
                    </Text>
                  </Box>
                  <Text
                    variant={{ base: 'secondary', md: 'secondary' }}
                    mb={{ base: '2', md: '0' }}
                  >
                    {attribute.value}
                  </Text>
                </Stack>
              )
            )
          })}
        </VStack>
      </VStack>
    </Card>
  )
}
