import { HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { ReactNode } from 'react'
import { TokenIcon } from '../TokenIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Numberish, fNum } from '@/lib/shared/utils/numbers'

type Props = {
  address: Address
  chain: GqlChain
  value: Numberish
  customRender?: (token: GqlToken) => ReactNode | ReactNode[]
}

export default function TokenRow({ address, value, customRender, chain }: Props) {
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()
  const token = getToken(address, chain)

  const totalValue = token ? usdValueForToken(token, value) : '0'

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <TokenIcon chain={chain} address={address} size={32} alt={token?.symbol || address} />
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
            {fNum('token', value)}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {toCurrency(totalValue)}
          </Text>
        </VStack>
        {customRender && token && customRender(token)}
      </HStack>
    </HStack>
  )
}
