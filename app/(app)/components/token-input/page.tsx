'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenInput } from '@/lib/shared/components/inputs/TokenInput/TokenInput'
import { Heading, VStack } from '@chakra-ui/react'

export default function TokenInputPage() {
  const { tokens } = useTokens()

  console.log(tokens)

  return (
    <VStack width="xl" align="start" p="md">
      <Heading>Token Input</Heading>
      <TokenInput token={tokens[0]} weight="50" />
    </VStack>
  )
}
