'use client'

import { Card, Heading, Link, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { getPoolRisks, risksTitle } from './usePoolRisks'

export function PoolRisks() {
  const { pool } = usePool()
  const risks = getPoolRisks(pool as GqlPoolElement)

  return (
    <Card variant="level2" shadow="2xl" width="full" px="4" py="5" borderWidth={0}>
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool risks
        </Heading>
        <VStack width="full" alignItems="flex-start">
          <Text variant="secondary">{risksTitle()}</Text>
          <UnorderedList>
            {risks.map(risk => (
              <Link
                key={`pool-risk-${risk.path.replaceAll('//', '')}`}
                href={risk.path}
                target="_blank"
              >
                <ListItem>{risk.title}</ListItem>
              </Link>
            ))}
          </UnorderedList>
        </VStack>
      </VStack>
    </Card>
  )
}
