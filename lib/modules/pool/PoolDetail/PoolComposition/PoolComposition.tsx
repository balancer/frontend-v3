'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { Box, Card, HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { usePool } from '../../usePool'
import { Address } from 'viem'
import { GqlPoolToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import Image from 'next/image'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'

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

  return (
    <Card variant="elevation2" shadow="2xl" width="full" minHeight="320px">
      <VStack spacing="0" width="full">
        <HStack width="full" p="4" justifyContent="space-between">
          <Heading fontWeight="bold" size="h5">
            Pool Composition
          </Heading>
        </HStack>
        <Box width="full" p="4" pt="0">
          <Card variant="elevation2" borderWidth={1} borderColor="borderColor" shadow="none">
            <VStack width="full">
              <Box width="full" borderBottomWidth={1} borderColor="border.base">
                <HStack py="4" px="4" width="full" justifyContent="space-between">
                  <VStack spacing="1" alignItems="flex-start">
                    <Heading fontWeight="bold" size="h6">
                      Total Liquidity
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      Share of Balancer liquidity
                    </Text>
                  </VStack>
                  <VStack spacing="1" alignItems="flex-end">
                    <Heading fontWeight="bold" size="h6">
                      {totalLiquidity ? (
                        toCurrency(totalLiquidity)
                      ) : (
                        <Skeleton height="24px" w="75px" />
                      )}
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      8.69% (TODO INTEGRATE)
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <VStack spacing="4" p="4" py="2" pb="4" width="full">
                {(pool.tokens as GqlPoolToken[]).map(poolToken => {
                  return (
                    <TokenRow
                      chain={chain}
                      key={`my-liquidity-token-${poolToken.address}`}
                      address={poolToken.address as Address}
                      value={poolToken.balance}
                      customRender={() => {
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
    </Card>
  )
}
