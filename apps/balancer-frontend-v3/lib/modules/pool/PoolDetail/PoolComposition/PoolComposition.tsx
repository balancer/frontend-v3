'use client'

import { Card, Divider, HStack, Heading, Skeleton, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { usePool } from '../../PoolProvider'
import { Address } from 'viem'
import { GqlChain, GqlPoolTokenDetail } from '@/lib/shared/services/api/generated/graphql'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { PoolZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import { PoolWeightChart } from '../PoolWeightCharts/PoolWeightChart'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'
import { getPoolDisplayTokens } from '../../pool.utils'

type CardContentProps = {
  totalLiquidity: string
  displayTokens: GqlPoolTokenDetail[]
  chain: GqlChain
}

function CardContent({ totalLiquidity, displayTokens, chain }: CardContentProps) {
  const { toCurrency } = useCurrency()
  const { calcWeightForBalance } = useTokens()
  const { pool } = usePool()

  return (
    <VStack spacing="md" width="full">
      <HStack justifyContent="space-between" width="full">
        <VStack alignItems="flex-start">
          <Heading fontWeight="bold" size={{ base: 'h5', md: 'h6' }}>
            Total liquidity
          </Heading>
        </VStack>
        <VStack alignItems="flex-end">
          <Heading fontWeight="bold" size={{ base: 'h5', md: 'h6' }}>
            {totalLiquidity ? (
              toCurrency(totalLiquidity, { abbreviated: false })
            ) : (
              <Skeleton height="24px" w="75px" />
            )}
          </Heading>
        </VStack>
      </HStack>
      <Divider />
      <VStack spacing="md" width="full">
        {displayTokens.map(poolToken => {
          return (
            <TokenRow
              actualWeight={calcWeightForBalance(
                poolToken.address,
                poolToken.balance,
                totalLiquidity,
                chain
              )}
              address={poolToken.address as Address}
              chain={chain}
              key={`my-liquidity-token-${poolToken.address}`}
              pool={pool}
              targetWeight={poolToken.weight || undefined}
              value={poolToken.balance}
            />
          )
        })}
      </VStack>
    </VStack>
  )
}

export function PoolComposition() {
  const { pool, chain, isLoading } = usePool()
  const { isMobile } = useBreakpoints()
  const { calcTotalUsdValue } = useTokens()

  const displayTokens = getPoolDisplayTokens(pool)
  const totalLiquidity = calcTotalUsdValue(displayTokens, chain)

  function CardContentBlock() {
    return (
      <CardContent chain={chain} displayTokens={displayTokens} totalLiquidity={totalLiquidity} />
    )
  }

  return (
    <Card>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent="stretch"
        minH="400px"
        spacing="md"
      >
        <VStack align="flex-start" spacing="md" w="full">
          <Heading fontWeight="bold" size={{ base: 'h4', md: 'h5' }}>
            Pool composition
          </Heading>
          {isMobile ? (
            <CardContentBlock />
          ) : (
            <Card variant="subSection" w="full">
              <CardContentBlock />
            </Card>
          )}
          {isMobile ? <Divider /> : null}
          <Text color="grayText" fontSize="sm" mt="auto" pb="sm">
            From {fNum('integer', pool.dynamicData.holdersCount)} Liquidity Providers
          </Text>
        </VStack>
        <NoisyCard
          cardProps={{ position: 'relative', overflow: 'hidden', height: ['300px', '400px'] }}
          contentProps={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <PoolZenGarden poolType={pool.type} sizePx={isMobile ? '300px' : '400px'} />
          {isLoading ? (
            <Skeleton h="full" w="full" />
          ) : (
            <PoolWeightChart
              chain={chain}
              displayTokens={displayTokens}
              totalLiquidity={totalLiquidity}
            />
          )}
        </NoisyCard>
      </Stack>
    </Card>
  )
}
