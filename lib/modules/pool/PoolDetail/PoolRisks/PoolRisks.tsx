import { Card, Heading, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'

const RISK_MAP = {
  WEIGHTED: 'Weighted pool risks',
  BALANCER: 'General balancer protocol risks',
  MUTABLE: 'Mutable attributes risks',
}
type Attributes = keyof typeof RISK_MAP

function determinePoolRisks(pool: GqlPoolElement) {
  // includes default risks
  const poolRisks: Attributes[] = ['BALANCER']

  if (pool.type === 'WEIGHTED') {
    poolRisks.push('WEIGHTED')
  }
  if (pool.owner !== '0xxx') {
    poolRisks.push('MUTABLE')
  }
  return poolRisks
}

export function PoolRisks() {
  const { pool } = usePool()
  const risks = determinePoolRisks(pool as GqlPoolElement)

  return (
    <Card minHeight="175px" width="full" variant="level3" px="6" py="5">
      <VStack alignItems="flex-start" spacing="4" width="full">
        <Heading variant="h4" fontSize="1.25rem">
          Pool risks
        </Heading>
        <VStack width="full" alignItems="flex-start">
          <Text variant="secondary">
            Liquidity providers in this pool face the following risks:
          </Text>
          <UnorderedList>
            {risks.map(risk => (
              <ListItem key={`pool-risk-${risk}`}>{RISK_MAP[risk]}</ListItem>
            ))}
          </UnorderedList>
        </VStack>
      </VStack>
    </Card>
  )
}
