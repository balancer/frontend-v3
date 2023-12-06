'use client'

import { humanizeObject } from '@/lib/debug-helpers'
import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { HumanAmount } from '@balancer/sdk'
import { useDisclosure } from '@chakra-ui/hooks'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Button, Card, Center, HStack, Heading, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useRef } from 'react'
import { Address } from 'wagmi'
import { AddLiquidityModal } from './AddLiquidityModal'
import { useAddLiquidity } from './useAddLiquidity'

export function AddLiquidityForm() {
  const {
    amountsIn,
    totalUSDValue,
    setAmountIn,
    tokens,
    validTokens,
    formattedPriceImpact,
    addLiquidityQuery,
  } = useAddLiquidity()
  const { toCurrency } = useCurrency()

  const previewDisclosure = useDisclosure()
  const nextBtn = useRef(null)

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => isSameAddress(amountIn.tokenAddress, tokenAddress))
    return amountIn ? amountIn.humanAmount : ''
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
                    onChange={e =>
                      setAmountIn(token.address as Address, e.currentTarget.value as HumanAmount)
                    }
                  />
                )
              })}
            </VStack>

            <VStack spacing="sm" align="start" w="full">
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Total</Text>
                <HStack>
                  <NumberText color="GrayText">{toCurrency(totalUSDValue)}</NumberText>
                  <Tooltip label="Total" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Price impact</Text>
                <HStack>
                  <NumberText color="GrayText">{formattedPriceImpact}</NumberText>
                  <Tooltip label="Price impact" fontSize="sm">
                    <InfoOutlineIcon color="GrayText" />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text color="GrayText">Bpt out (debug)</Text>
                <HStack>
                  <NumberText color="GrayText">
                    {humanizeObject(addLiquidityQuery?.bptOut || {})}
                  </NumberText>
                  <Tooltip label="Bpt our" fontSize="sm">
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
