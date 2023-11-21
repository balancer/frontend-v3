import { HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import TokenAvatar from '@/lib/shared/components/token/TokenAvatar'
import { useNumbers } from '@/lib/shared/hooks/useNumbers'
import { ReactNode } from 'react'

type Props = {
  address: Address
  chain: GqlChain
  value: number
  customRender?: (token: GqlToken) => ReactNode | ReactNode[]
}

export default function TokenRow({ address, value, customRender, chain }: Props) {
  const { getToken, priceFor } = useTokens()
  const { toCurrency } = useNumbers()
  const token = getToken(address, chain)
  const totalTokenValue = priceFor(address, chain)

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <TokenAvatar chain={chain} address={address} size="sm" bg="red.500" />
        <VStack spacing="1" alignItems="flex-start">
          <Heading fontWeight="bold" as="h6" fontSize="1rem">
            {token?.symbol}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {token?.name}
          </Text>
        </VStack>
      </HStack>
      <HStack spacing="8">
        <VStack spacing="1" alignItems="flex-end">
          <Heading fontWeight="bold" as="h6" fontSize="1rem">
            {value || 0.0}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {toCurrency(totalTokenValue)}
          </Text>
        </VStack>
        {customRender && token && customRender(token)}
      </HStack>
    </HStack>
  )
}
