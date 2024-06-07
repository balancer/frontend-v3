'use client'

import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { Box, Card, CardProps, HStack, Heading, Link, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../PoolProvider'
import { ArrowUpRight } from 'react-feather'
import { useMemo } from 'react'

export function PoolContracts({ ...props }: CardProps) {
  const { pool, poolExplorerLink, hasGaugeAddress, gaugeAddress, gaugeExplorerLink } = usePool()

  const contracts = useMemo(() => {
    const contracts = [
      {
        label: 'Pool',
        address: pool.address,
        explorerLink: poolExplorerLink,
      },
    ]

    if (hasGaugeAddress) {
      contracts.push({
        label: 'Gauge',
        address: gaugeAddress,
        explorerLink: gaugeExplorerLink,
      })
    }

    return contracts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, hasGaugeAddress])

  return (
    <Card {...props}>
      <VStack alignItems="flex-start" spacing="md" width="full">
        <Heading variant="h4" fontSize="xl">
          Pool contracts
        </Heading>
        <VStack width="full">
          {contracts.map(contract => (
            <HStack key={contract.label} width="full" spacing="xs">
              <Box minWidth="20">
                <Text variant="secondary">{contract.label}</Text>
              </Box>
              <Link target="_blank" href={contract.explorerLink} variant="link">
                <HStack>
                  <Text color="link">{abbreviateAddress(contract.address)}</Text>
                  <ArrowUpRight size={12} />
                </HStack>
              </Link>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Card>
  )
}
