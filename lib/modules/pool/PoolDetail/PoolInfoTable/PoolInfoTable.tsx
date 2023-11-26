import { Box, Card, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { usePoolInfo } from './usePoolInfo'
import { upperFirst } from 'lodash'

const CAPITALISED_FIELDS = ['Pool type']

export function PoolAttributes() {
  const { poolDetails } = usePoolInfo()

  return (
    <Card width="50%" variant="level3" px="6" py="5">
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool attributes
        </Heading>
        <VStack width="full">
          <HStack spacing="8" width="full">
            <Box minWidth="150px">
              <Heading variant="h6" fontSize="1rem">
                Attribute
              </Heading>
            </Box>
            <Heading variant="h6" fontSize="1rem">
              Details
            </Heading>
          </HStack>
          {poolDetails.map(detail => {
            let formattedValue = detail?.value
            if (CAPITALISED_FIELDS.includes(detail?.title || '')) {
              formattedValue = upperFirst(detail?.value.toLowerCase())
            }

            return (
              detail && (
                <HStack width="full" spacing="8" key={`pool-detail-${detail.title}`}>
                  <Box minWidth="150px">
                    <Text variant="secondary">{detail.title}</Text>
                  </Box>
                  <Text variant="secondary">{formattedValue}</Text>
                </HStack>
              )
            )
          })}
        </VStack>
      </VStack>
    </Card>
  )
}
