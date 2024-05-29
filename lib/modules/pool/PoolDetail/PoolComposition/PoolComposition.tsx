'use client'

import {
  Box,
  Card,
  Divider,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { usePool } from '../../PoolProvider'
import { Address } from 'viem'
import {
  GqlChain,
  GqlPoolTokenDetail,
  GqlPoolTokenDisplay,
} from '@/lib/shared/services/api/generated/graphql'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { PoolZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import { PoolWeightChart } from '../PoolWeightCharts/PoolWeightChart'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'

type CardContentProps = {
  totalLiquidity: string
  displayTokens: GqlPoolTokenDetail[]
  chain: GqlChain
}

function CardContent({ totalLiquidity, displayTokens, chain }: CardContentProps) {
  const { toCurrency } = useCurrency()
  const { calcWeightForBalance } = useTokens()

  return (
    <VStack spacing="md" width="full">
      <HStack width="full" justifyContent="space-between">
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
              chain={chain}
              key={`my-liquidity-token-${poolToken.address}`}
              address={poolToken.address as Address}
              value={poolToken.balance}
              actualWeight={calcWeightForBalance(
                poolToken.address,
                poolToken.balance,
                totalLiquidity,
                chain
              )}
              targetWeight={poolToken.weight || undefined}
            />
          )
        })}
      </VStack>
    </VStack>
  )
}

export function PoolComposition() {
  const { pool, chain, isLoading } = usePool()
  const [totalLiquidity, setTotalLiquidity] = useState('')
  const { isMobile } = useBreakpoints()

  useEffect(() => {
    if (pool) {
      setTotalLiquidity(pool.dynamicData.totalLiquidity)
    }
  }, [pool])

  const displayTokens = pool.poolTokens.filter(token =>
    pool.displayTokens.find(
      (displayToken: GqlPoolTokenDisplay) => token.address === displayToken.address
    )
  ) as GqlPoolTokenDetail[]

  return (
    <Card>
      <Stack
        spacing="md"
        minH="400px"
        direction={{ base: 'column', md: 'row' }}
        justifyContent="stretch"
      >
        <VStack w="full" spacing="md" align="flex-start">
          <Heading fontWeight="bold" size={{ base: 'h4', md: 'h5' }}>
            Pool composition
          </Heading>
          {isMobile ? (
            <CardContent
              totalLiquidity={totalLiquidity}
              displayTokens={displayTokens}
              chain={chain}
            />
          ) : (
            <Card variant="subSection" w="full">
              <CardContent
                totalLiquidity={totalLiquidity}
                displayTokens={displayTokens}
                chain={chain}
              />
            </Card>
          )}
          {isMobile && <Divider />}
          <Text color="grayText" mt="auto" fontSize="sm" pb="sm">
            From {fNum('integer', pool.dynamicData.holdersCount)} Liquidity Providers
          </Text>
        </VStack>
        <NoisyCard
          cardProps={{ position: 'relative', overflow: 'hidden' }}
          contentProps={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <PoolZenGarden sizePx={isMobile ? '300px' : '400px'} poolType={pool.type} />
          {isLoading ? (
            <Skeleton w="full" h="full" />
          ) : (
            <Box mt={{ base: '0', md: '-6' }} p={{ base: 'sm', md: '0' }}>
              <PoolWeightChart pool={pool} chain={chain} />
            </Box>
          )}
        </NoisyCard>
      </Stack>
    </Card>
  )
}
