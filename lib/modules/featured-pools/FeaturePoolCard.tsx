'use client'

import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Pool } from '../pool/usePool'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useRouter } from 'next/navigation'
import { Card, HStack, VStack, Text, Center } from '@chakra-ui/react'
import {
  poolClickHandler,
  poolMouseEnterHandler,
  getAprLabel,
  getPoolTypeLabel,
} from '../pool/pool.utils'
import PoolWeightChart from '../pool/PoolDetail/PoolWeightCharts/PoolWeightChart'
import { PoolName } from '../pool/PoolName'

interface Props {
  pool: Pool
  chain: GqlChain
  isSmall?: boolean
  hasLegend?: boolean
}

export function FeaturePoolCard({ pool, chain, isSmall = false, hasLegend = false }: Props) {
  const { toCurrency } = useCurrency()
  const router = useRouter()

  return (
    <Card
      variant="gradient"
      h="full"
      w="full"
      p="4"
      cursor="pointer"
      onClick={event => poolClickHandler(event, pool.id, pool.chain, router)}
      onMouseEnter={event => poolMouseEnterHandler(event, pool.id, pool.chain, router)}
    >
      <VStack justifyContent="space-between" h="full">
        <HStack justifyContent="center" w="full" spacing="sm">
          <Text variant="secondary" fontWeight="medium">
            {getPoolTypeLabel(pool.type)}
          </Text>
          <Text variant="secondary" fontWeight="medium">
            &#x2022;
          </Text>
          <Text variant="secondary" fontWeight="medium">
            {toCurrency(pool.dynamicData.totalLiquidity)} TVL
          </Text>
        </HStack>
        <PoolWeightChart pool={pool} chain={chain} hasLegend={hasLegend} isSmall={isSmall} />
        <Center>
          <VStack>
            <PoolName pool={pool} fontWeight="bold" fontSize="lg" noOfLines={1} />
            <Text variant="secondary" fontWeight="medium">
              {getAprLabel(pool.dynamicData.apr.apr)} APR
            </Text>
          </VStack>
        </Center>
      </VStack>
    </Card>
  )
}
