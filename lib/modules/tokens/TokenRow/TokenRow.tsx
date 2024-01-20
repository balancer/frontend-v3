import { HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
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
  usdValue?: string
  customRender?: (token: GqlToken) => ReactNode | ReactNode[]
  isSelected?: boolean
  isLoading?: boolean
}

export default function TokenRow({
  address,
  value,
  usdValue,
  customRender,
  chain,
  isSelected,
  isLoading,
}: Props) {
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()
  const token = getToken(address, chain)

  const getUsdValue = () => {
    if (usdValue) return usdValue
    if (token) return usdValueForToken(token, value)
    return '0'
  }

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack>
        <TokenIcon chain={chain} address={address} size={32} alt={token?.symbol || address} />
        <VStack spacing="1" alignItems="flex-start">
          <Heading
            fontWeight="bold"
            as="h6"
            fontSize="1rem"
            variant={isSelected ? 'primary' : 'secondary'}
          >
            {token?.symbol}
          </Heading>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {token?.name}
          </Text>
        </VStack>
      </HStack>
      <HStack spacing="8">
        <VStack spacing="1" alignItems="flex-end">
          {isLoading ? (
            <Skeleton w="10" h="4" />
          ) : (
            <Heading fontWeight="bold" as="h6" fontSize="1rem">
              {fNum('token', value)}
            </Heading>
          )}

          {isLoading ? (
            <Skeleton w="10" h="4" />
          ) : (
            <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
              {toCurrency(getUsdValue())}
            </Text>
          )}
        </VStack>
        {customRender && token && customRender(token)}
      </HStack>
    </HStack>
  )
}
