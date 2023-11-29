import { shortenLabel } from '@/lib/shared/utils/addresses'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Card, HStack, Heading, Link, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'

export function PoolContracts() {
  const { pool, poolHelpers } = usePool()
  return (
    <Card minHeight="175px" width="full" variant="level3" px="6" py="5">
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool contracts
        </Heading>
        <VStack width="full">
          <HStack width="full" spacing="8">
            <Box minWidth="150px">
              <Text variant="secondary">Pool</Text>
            </Box>
            <Link target="_blank" href={poolHelpers.getBlockExplorerPoolLink()}>
              <HStack>
                <Text variant="secondary">{shortenLabel(pool.address)}</Text>
                <ExternalLinkIcon color="gray.400" width="1rem" height="1rem" />
              </HStack>
            </Link>
          </HStack>
          {poolHelpers.hasGaugeAddress() && (
            <HStack width="full" spacing="8">
              <Box minWidth="150px">
                <Text variant="secondary">Gauge</Text>
              </Box>
              <Link target="_blank" href={poolHelpers.getBlockExplorerGaugeLink()}>
                <HStack>
                  <Text variant="secondary">{shortenLabel(poolHelpers.getGaugeAddress())}</Text>
                  <ExternalLinkIcon color="gray.400" width="1rem" height="1rem" />
                </HStack>
              </Link>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Card>
  )
}
