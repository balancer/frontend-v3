'use client'

import { useDisclosure } from '@chakra-ui/hooks'
import { useAddLiquidity } from './useAddLiquidity'
import { useRef } from 'react'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { Button, Card, Center, HStack, Heading, VStack, Text, Tooltip } from '@chakra-ui/react'
import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { AddLiquidityModal } from './AddLiquidityModal'
import { priceImpactFormat, useNumbers } from '@/lib/shared/hooks/useNumbers'
import { InfoOutlineIcon } from '@chakra-ui/icons'

export function AddLiquidityForm() {
  const { amountsIn, totalUSDValue, setAmountIn, tokens, validTokens } = useAddLiquidity()
  const { toCurrency } = useNumbers()
  const previewDisclosure = useDisclosure()
  const nextBtn = useRef(null)

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => amountIn[tokenAddress])
    return amountIn ? amountIn[tokenAddress] : ''
  }

  function submit() {
    console.log(amountsIn)
    previewDisclosure.onOpen()
  }

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <Center h="full" w="full" maxW="lg" mx="auto">
        <Card variant="level3" shadow="xl" w="full" p="md">
          <VStack spacing="lg" align="start">
            <HStack>
              <Heading fontWeight="bold" size="h5">
                Add liquidity
              </Heading>
            </HStack>
            <VStack spacing="md" w="full">
              {tokens.map(token => {
                if (!token) return <div>Missing token</div>
                return (
                  <TokenInput
                    key={token.address}
                    address={token.address}
                    chain={token.chain}
                    value={currentValueFor(token.address)}
                    onChange={e => setAmountIn(token.address, e.currentTarget.value)}
                  />
                )
              })}
            </VStack>

            <VStack spacing="sm" align="start" w="full">
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Total</Text>
                <HStack>
                  <Text color="GrayText" style={{ fontVariantNumeric: 'tabular-nums ' }}>
                    {toCurrency(totalUSDValue)}
                  </Text>
                  <Tooltip label="Total" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Price impact</Text>
                <HStack>
                  <Text color="GrayText" style={{ fontVariantNumeric: 'tabular-nums ' }}>
                    {priceImpactFormat(0)}
                  </Text>
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>

            <Button ref={nextBtn} variant="secondary" w="full" size="lg" onClick={submit}>
              Next
            </Button>
          </VStack>
        </Card>
        <AddLiquidityModal
          finalFocusRef={nextBtn}
          isOpen={previewDisclosure.isOpen}
          onOpen={previewDisclosure.onOpen}
          onClose={previewDisclosure.onClose}
        />
      </Center>
    </TokenBalancesProvider>
  )
}
