import { HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { ReactNode } from 'react'
import { TokenIcon } from '../TokenIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Numberish, fNum } from '@/lib/shared/utils/numbers'
import { HiExternalLink } from 'react-icons/hi'
import Link from 'next/link'
import { useBlockExplorer } from '@/lib/shared/hooks/useBlockExplorer'
import { Pool } from '../../pool/usePool'
import { bptUsdValue } from '../../pool/pool.helpers'

type Props = {
  address: Address
  chain: GqlChain
  value: Numberish
  customRender?: (token: GqlToken) => ReactNode | ReactNode[]
  isSelected?: boolean
  isLoading?: boolean
  abbreviated?: boolean
  isBpt?: boolean
  pool?: Pool
}

export default function TokenRow({
  address,
  value,
  customRender,
  chain,
  isSelected,
  isLoading,
  abbreviated = true,
  isBpt,
  pool,
}: Props) {
  const { getToken, usdValueForToken } = useTokens()
  const { toCurrency } = useCurrency()
  const { getBlockExplorerTokenUrl } = useBlockExplorer(chain)

  const token = getToken(address, chain)
  let usdValue: string | undefined
  if (isBpt && pool) {
    usdValue = bptUsdValue(pool, value)
  } else {
    usdValue = token ? usdValueForToken(token, value) : undefined
  }

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack spacing="md">
        <TokenIcon chain={chain} address={address} size={36} alt={token?.symbol || address} />
        <VStack spacing="1" alignItems="flex-start">
          <HStack>
            <Heading
              fontWeight="bold"
              as="h6"
              fontSize="md"
              variant={isSelected ? 'primary' : 'secondary'}
            >
              {token?.symbol}
            </Heading>
            <Text
              as={Link}
              href={getBlockExplorerTokenUrl(address)}
              color="gray.500"
              target="_blank"
            >
              <HiExternalLink />
            </Text>
          </HStack>

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
              {fNum('token', value, { abbreviated })}
            </Heading>
          )}

          {isLoading ? (
            <Skeleton w="10" h="4" />
          ) : (
            <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
              {usdValue ? toCurrency(usdValue, { abbreviated }) : '-'}
            </Text>
          )}
        </VStack>
        {customRender && token && customRender(token)}
      </HStack>
    </HStack>
  )
}
