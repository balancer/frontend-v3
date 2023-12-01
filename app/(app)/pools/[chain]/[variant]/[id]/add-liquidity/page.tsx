'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { usePool } from '@/lib/modules/pool/usePool'
import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { makeVar, useReactiveVar } from '@apollo/client'
import { Button, Card, Center, HStack, Heading, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'

type AmountIn = {
  [tokenAddress: string]: string
}

export const amountsInVar = makeVar<AmountIn[]>([])

export default function AddLiquidityPage() {
  const amountsIn = useReactiveVar(amountsInVar)
  const { pool } = usePool()
  const { getToken } = useTokens()

  function setInitialAmountsIn() {
    const amountsIn = pool.allTokens.map(token => ({
      [token.address]: '',
    }))
    amountsInVar(amountsIn)
  }

  function currentValueFor(tokenAddress: string) {
    const amountIn = amountsIn.find(amountIn => amountIn[tokenAddress])
    return amountIn ? amountIn[tokenAddress] : ''
  }

  function setAmountIn(tokenAddress: string, amount: string) {
    const state = amountsInVar()
    amountsInVar(
      state.map(amountIn => ({
        ...amountIn,
        [tokenAddress]: amount,
      }))
    )
  }

  useEffect(() => {
    setInitialAmountsIn()
  }, [])

  const tokens = pool.allTokens.map(t => getToken(t.address, pool.chain))
  const validTokens = tokens.filter((t): t is GqlToken => !!t)

  return (
    <TokenBalancesProvider tokens={validTokens}>
      <PoolActionsLayout>
        <Center h="full" w="full" maxW="lg" mx="auto">
          <Card variant="level3" shadow="xl" w="full" p="md">
            <VStack spacing="md" align="start">
              <HStack>
                <Heading fontWeight="bold" size="h5">
                  Add liquidity
                </Heading>
              </HStack>
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
              <Button variant="primary" w="full" size="lg">
                Submit
              </Button>
            </VStack>
          </Card>
        </Center>
      </PoolActionsLayout>
    </TokenBalancesProvider>
  )
}
