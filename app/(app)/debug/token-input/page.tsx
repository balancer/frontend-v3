'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { Heading, Text, VStack, useDisclosure } from '@chakra-ui/react'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useState } from 'react'
import { TokenSelectModal } from '@/lib/modules/tokens/TokenSelectModal/TokenSelectModal'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { BalInput } from '@/lib/shared/components/inputs/BalInput'

export default function TokenInputPage() {
  const [currentValue, setCurrentValue] = useState('')
  const [normalValue, setNormalValue] = useState('')
  const { getToken, getTokensByChain } = useTokens()
  const tokenSelectDisclosure = useDisclosure()
  const [token, setToken] = useState<GqlToken>(
    getToken('0x6B175474E89094C44Da98b954EedeAC495271d0F', 1) as GqlToken
  )

  const tokens = getTokensByChain(1)

  function handleTokenSelect(token: GqlToken) {
    setToken(token)
  }

  return (
    <TokenBalancesProvider tokens={tokens}>
      <VStack width="sm" align="start" p="md">
        <Heading>Normal input</Heading>
        <Text>Current value: {normalValue}</Text>
        <BalInput
          value={normalValue}
          type="text"
          onChange={e => setNormalValue(e.currentTarget.value)}
        />

        <Heading>Token Input</Heading>
        <Text>Current value: {currentValue}</Text>
        <TokenInput
          address={token.address}
          chain={token.chain}
          value={currentValue}
          onChange={e => setCurrentValue(e.currentTarget.value)}
          toggleTokenSelect={() => {
            tokenSelectDisclosure.onOpen()
          }}
        />
        <TokenSelectModal
          tokens={tokens}
          isOpen={tokenSelectDisclosure.isOpen}
          onOpen={tokenSelectDisclosure.onOpen}
          onClose={tokenSelectDisclosure.onClose}
          onTokenSelect={handleTokenSelect}
        />
      </VStack>
    </TokenBalancesProvider>
  )
}
