'use client'

import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { Box, Card, HStack, Heading, Link, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { ExternalLink } from 'react-feather'

export function PoolContracts() {
  const { pool, poolExplorerLink, hasGaugeAddress, gaugeAddress, gaugeExplorerLink } = usePool()
  return (
    <Card variant="level2" shadow="2xl" width="full" px="4" py="5" borderWidth={0}>
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool contracts
        </Heading>
        <VStack width="full">
          <HStack width="full" spacing="8">
            <Box minWidth="150px">
              <Text variant="secondary">Pool</Text>
            </Box>
            <Link target="_blank" href={poolExplorerLink}>
              <HStack color="gray.400">
                <Text variant="secondary">{abbreviateAddress(pool.address)}</Text>
                <ExternalLink size={12} />
              </HStack>
            </Link>
          </HStack>
          {hasGaugeAddress && (
            <HStack width="full" spacing="8">
              <Box minWidth="150px">
                <Text variant="secondary">Gauge</Text>
              </Box>
              <Link target="_blank" href={gaugeExplorerLink}>
                <HStack color="gray.400">
                  <Text variant="secondary">{abbreviateAddress(gaugeAddress)}</Text>
                  <ExternalLink size={12} />
                </HStack>
              </Link>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Card>
  )
}
