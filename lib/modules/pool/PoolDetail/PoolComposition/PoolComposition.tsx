'use client'

import {
  Box,
  Card,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { usePool } from '../../usePool'
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
import PoolWeightChart from '../PoolWeightCharts/PoolWeightChart'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import PoolCompositionTokenRow from './PoolCompositionTokenRow'

type CardContentProps = {
  totalLiquidity: string
  displayTokens: GqlPoolTokenDetail[]
  chain: GqlChain
}

function CardContent({ totalLiquidity, displayTokens, chain }: CardContentProps) {
  const { toCurrency } = useCurrency()

  return (
    <VStack spacing="md" width="full">
      <HStack width="full" justifyContent="space-between">
        <VStack alignItems="flex-start">
          <Heading fontWeight="bold" size="h6">
            Total liquidity
          </Heading>
          {/* <Text variant="secondary" fontSize="0.85rem"> */}
          {/*   Share of Balancer liquidity */}
          {/* </Text> */}
        </VStack>
        <VStack alignItems="flex-end">
          <Heading fontWeight="bold" size="h6">
            {totalLiquidity ? (
              toCurrency(totalLiquidity, { abbreviated: false })
            ) : (
              <Skeleton height="24px" w="75px" />
            )}
          </Heading>
          {/* <Text variant="secondary" fontSize="0.85rem"> */}
          {/*   8.69% (TODO INTEGRATE) */}
          {/* </Text> */}
        </VStack>
      </HStack>
      <Divider />
      <VStack spacing="md" width="full">
        {displayTokens.map(poolToken => {
          return (
            <PoolCompositionTokenRow
              chain={chain}
              key={`my-liquidity-token-${poolToken.address}`}
              address={poolToken.address as Address}
              value={poolToken.balance}
              poolToken={poolToken}
              totalLiquidity={totalLiquidity}
            />
          )
        })}
      </VStack>
    </VStack>
  )
}

export function PoolComposition() {
  const { pool, chain } = usePool()
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
    <Card
      height={{ base: 'auto', md: '400px' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      p="md"
    >
      <Grid w="full" h="full" templateColumns={{ base: '1fr)', lg: 'repeat(2,1fr)' }} gap="md">
        <GridItem>
          <VStack w="full" h="full" spacing="md" align="flex-start">
            <Heading fontWeight="bold" size="h5">
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
            <Text color="grayText" mt="auto" fontSize="sm">
              From {fNum('integer', pool.dynamicData.holdersCount)} Liquidity Providers
            </Text>
          </VStack>
        </GridItem>
        <GridItem>
          <NoisyCard
            cardProps={{ position: 'relative', overflow: 'hidden' }}
            contentProps={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <PoolZenGarden sizePx="400px" poolType={pool.type} />
            <VStack spacing="4">
              <Box mt="-6">
                <PoolWeightChart pool={pool} chain={chain} />
              </Box>
            </VStack>
          </NoisyCard>
        </GridItem>
      </Grid>
    </Card>
  )
}
