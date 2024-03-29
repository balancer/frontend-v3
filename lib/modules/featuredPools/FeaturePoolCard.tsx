'use client'

import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Pool } from '../pool/usePool'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useRouter } from 'next/navigation'
import { Card, HStack, VStack, Text, Center, Box } from '@chakra-ui/react'
import {
  poolClickHandler,
  poolMouseEnterHandler,
  getAprLabel,
  getPoolTypeLabel,
} from '../pool/pool.utils'
import PoolWeightChart from '../pool/PoolDetail/PoolWeightCharts/PoolWeightChart'
import { PoolName } from '../pool/PoolName'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'

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
    <VStack
      cursor="pointer"
      onClick={event => poolClickHandler(event, pool.id, pool.chain, router)}
      onMouseEnter={event => poolMouseEnterHandler(event, pool.id, pool.chain, router)}
      justifyContent="center"
      spacing={isSmall ? '3' : '4'}
      h="full"
    >
      {!isSmall && (
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
      )}
      <Box>
        <PoolWeightChart pool={pool} chain={chain} hasLegend={hasLegend} isSmall={isSmall} />
      </Box>
      <Center>
        <VStack spacing="0">
          <PoolName pool={pool} fontWeight="bold" fontSize="lg" noOfLines={1} />
          <Text variant="secondary" fontWeight="medium">
            {getAprLabel(pool.dynamicData.apr.apr)} APR
          </Text>
        </VStack>
      </Center>
    </VStack>
  )
}
