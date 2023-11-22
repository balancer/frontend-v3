'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenInput } from '@/lib/modules/tokens/TokenInput/TokenInput'
import { Heading, Text, VStack } from '@chakra-ui/react'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useState } from 'react'

export default function TokenInputPage() {
  const [currentValue, setCurrentValue] = useState('')
  const { getToken } = useTokens()

  const token = getToken('0x6B175474E89094C44Da98b954EedeAC495271d0F', 1) as GqlToken

  return (
    <VStack width="xl" align="start" p="md">
      <Heading>Token Input</Heading>
      <Text>Current value: {currentValue}</Text>
      <TokenInput
        address={token.address}
        chain={token.chain}
        value={currentValue}
        onChange={e => setCurrentValue(e.currentTarget.value)}
      />
    </VStack>
  )
}
