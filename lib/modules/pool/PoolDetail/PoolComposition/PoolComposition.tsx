import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import ButtonGroup, {
  ButtonGroupOption,
} from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Box, Card, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { usePool } from '../../usePool'
import { Address } from 'viem'

export function PoolComposition() {
  const { pool } = usePool()

  return (
    <Card variant="gradient" width="full" height="320px">
      <VStack spacing="0" width="full">
        <HStack width="full" p="4" justifyContent="space-between">
          <Heading fontWeight="bold" size="h5">
            Pool Composition
          </Heading>
        </HStack>
        <Box width="full" p="4" pt="0">
          <Card borderWidth={1} variant="level5" shadow="none">
            <VStack width="full">
              <Box width="full" borderBottomWidth={1} borderColor="borderColor">
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
                      $0.00
                    </Heading>
                    <Text variant="secondary" fontSize="0.85rem">
                      8.69%
                    </Text>
                  </VStack>
                </HStack>
              </Box>
              <VStack spacing="4" p="4" py="2" pb="4" width="full">
                {pool.allTokens.map(token => {
                  return (
                    <TokenRow
                      key={`my-liquidity-token-${token.address}`}
                      address={token.address as Address}
                      // TODO: Fill pool balances
                      value={0}
                      customRender={token => {
                        return (
                          <VStack spacing="1" alignItems="flex-end">
                            <Heading fontWeight="bold" as="h6" fontSize="1rem">
                              50.4%
                            </Heading>
                            <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                              50%
                            </Text>
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
