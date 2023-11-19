import { HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import TokenAvatar from '@/lib/shared/components/token/TokenAvatar'
import { useNumbers } from '@/lib/shared/hooks/useNumbers'
import { ReactNode } from 'react'

type Props = {
  address: Address
  value: number
  customRender?: (token: GqlToken) => ReactNode | ReactNode[]
}

export default function TokenRow({ address, value, customRender }: Props) {
  const { getToken, priceFor } = useTokens()
  const { toCurrency } = useNumbers()
  const token = getToken(address, 'MAINNET' as GqlChain)
  const totalTokenValue = priceFor(address, 'MAINNET' as GqlChain)

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <TokenAvatar address={address} size="sm" bg="red.500" />
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
