'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import {
  Box,
  Card,
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
  GqlPoolTokenDetail,
  GqlPoolTokenDisplay,
} from '@/lib/shared/services/api/generated/graphql'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import Image from 'next/image'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { isStableLike } from '../../pool.helpers'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { PoolZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import PoolBadges from '../PoolBadges'
import PoolWeightChart from '../PoolWeightCharts/PoolWeightChart'

export function PoolComposition() {
  const { pool, chain } = usePool()
  const { toCurrency } = useCurrency()
  const { getPoolTokenWeightByBalance } = useTokens()
  const [totalLiquidity, setTotalLiquidity] = useState('')

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

  const showWeightDistribution = !isStableLike(pool.type)

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
          <VStack w="full" spacing="md">
            <HStack width="full" justifyContent="space-between">
              <Heading fontWeight="bold" size="h5">
                Pool composition
              </Heading>
            </HStack>
            <Box width="full">
              <Card variant="subSection">
                <VStack spacing="md" width="full">
                  <Box pb="md" width="full" borderBottomWidth={1} borderColor="border.base">
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
                            toCurrency(totalLiquidity)
                          ) : (
                            <Skeleton height="24px" w="75px" />
                          )}
                        </Heading>
                        {/* <Text variant="secondary" fontSize="0.85rem"> */}
                        {/*   8.69% (TODO INTEGRATE) */}
                        {/* </Text> */}
                      </VStack>
                    </HStack>
                  </Box>
                  <VStack spacing="md" width="full">
                    {displayTokens.map(poolToken => {
                      return (
                        <TokenRow
                          chain={chain}
                          key={`my-liquidity-token-${poolToken.address}`}
                          address={poolToken.address as Address}
                          value={poolToken.balance}
                          customRender={() => {
                            if (!showWeightDistribution) return null
                            return (
                              <VStack minWidth="100px" spacing="1" alignItems="flex-end">
                                <Heading fontWeight="bold" as="h6" fontSize="1rem">
                                  {totalLiquidity ? (
                                    fNum(
                                      'weight',
                                      getPoolTokenWeightByBalance(totalLiquidity, poolToken, chain)
                                    )
                                  ) : (
                                    <Skeleton height="24px" w="75px" />
                                  )}
                                </Heading>
                                <HStack spacing="1">
                                  <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                                    {fNum('weight', poolToken.weight || '0')}
                                  </Text>
                                  <Image
                                    src="/images/icons/bullseye.svg"
                                    width="16"
                                    height="16"
                                    alt="Token weight - Bullseye"
                                  />
                                </HStack>
                              </VStack>
                            )
                          }}
                        />
                      )
                    })}
                  </VStack>
                </VStack>
              </Card>
            </Box>
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
