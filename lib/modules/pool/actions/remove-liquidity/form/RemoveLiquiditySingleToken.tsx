'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Box, HStack, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useRemoveLiquidity } from '../useRemoveLiquidity'

interface RemoveLiquiditySingleTokenProps {
  tokens: (GqlToken | undefined)[]
}

export function RemoveLiquiditySingleToken({ tokens }: RemoveLiquiditySingleTokenProps) {
  const { singleTokenOutAddress, setSingleTokenAddress, amountOutForToken } = useRemoveLiquidity()
  return (
    <VStack w="full">
      <HStack w="full" justify="space-between">
        <Text fontWeight="bold" fontSize="1rem">
          Choose a token to receive
        </Text>
      </HStack>
      <Box
        borderRadius="md"
        p="md"
        shadow="innerBase"
        bg="background.card.level1"
        border="white"
        w="full"
      >
        <RadioGroup
          onChange={tokenAddress => setSingleTokenAddress(tokenAddress as Address)}
          value={singleTokenOutAddress ?? tokens[0]?.address}
        >
          <VStack w="full">
            {tokens.map(
              token =>
                token && (
                  <HStack key={token.address} w="full">
                    <Radio value={token.address} />
                    <TokenRow
                      chain={token.chain}
                      address={token.address as Address}
                      value={amountOutForToken(token.address as Address)}
                      disabled={token.address !== singleTokenOutAddress}
                    />
                  </HStack>
                )
            )}
          </VStack>
        </RadioGroup>
      </Box>
    </VStack>
  )
}
