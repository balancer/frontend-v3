'use client'

import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Pool } from '../pool/usePool'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useRouter } from 'next/navigation'
import { HStack, VStack, Text, Box } from '@chakra-ui/react'
import {
  poolClickHandler,
  poolMouseEnterHandler,
  getAprLabel,
  getPoolTypeLabel,
} from '../pool/pool.utils'
import PoolWeightChart from '../pool/PoolDetail/PoolWeightCharts/PoolWeightChart'
import { PoolName } from '../pool/PoolName'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { PoolZenGarden } from '@/lib/shared/components/zen/ZenGarden'

interface Props {
  pool: Pool
  chain: GqlChain
  bgSize?: string
  isSmall?: boolean
  hasLegend?: boolean
}

export function FeaturePoolCard({
  pool,
  chain,
  bgSize = '500px',
  isSmall = false,
  hasLegend = false,
}: Props) {
  const { toCurrency } = useCurrency()
  const router = useRouter()

  return (
    <NoisyCard
      cardProps={{
        position: 'relative',
        overflow: 'hidden',
        onClick: event => poolClickHandler(event, pool.id, pool.chain, router),
        onMouseEnter: event => poolMouseEnterHandler(event, pool.id, pool.chain, router),
        cursor: 'pointer',
        _hover: { bg: 'background.level1' },
      }}
      contentProps={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PoolZenGarden subdued={isSmall} sizePx={bgSize} poolType={pool.type} />
      <VStack cursor="pointer" justifyContent="center" spacing={isSmall ? 'sm' : 'md'} h="full">
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
        <VStack spacing="0">
          <PoolName pool={pool} fontWeight="bold" fontSize="lg" noOfLines={1} />
          <Text variant="secondary" fontWeight="medium">
            {getAprLabel(pool.dynamicData.apr.apr)} APR
          </Text>
        </VStack>
      </VStack>
    </NoisyCard>
  )
}
