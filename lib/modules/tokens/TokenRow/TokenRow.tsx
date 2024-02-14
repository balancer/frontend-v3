/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { HStack, Heading, Skeleton, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { ReactNode, useEffect, useState } from 'react'
import { TokenIcon } from '../TokenIcon'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Numberish, fNum } from '@/lib/shared/utils/numbers'
import { Pool } from '../../pool/usePool'
import { bptUsdValue } from '../../pool/pool.helpers'
import { TokenInfoPopover } from '../TokenInfoPopover'

type Props = {
  address: Address
  chain: GqlChain
  value: Numberish
  usdValue?: string
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
  const [amount, setAmount] = useState<string>('')
  const [usdValue, setUsdValue] = useState<string | undefined>(undefined)
  const token = getToken(address, chain)

  useEffect(() => {
    if (value) {
      if (isBpt && pool) {
        setUsdValue(bptUsdValue(pool, value))
      } else if (token) {
        setUsdValue(usdValueForToken(token, value))
      }

      setAmount(fNum('token', value, { abbreviated }))
    }
  }, [value])

  return (
    <HStack width="full" justifyContent="space-between">
      <HStack spacing="md">
        <TokenIcon chain={chain} address={address} size={36} alt={token?.symbol || address} />
        <VStack spacing="xs" alignItems="flex-start">
          <HStack>
            <Heading
              fontWeight="bold"
              as="h6"
              fontSize="md"
              variant={isSelected ? 'primary' : 'secondary'}
            >
              {token?.symbol || pool?.symbol}
            </Heading>
            <TokenInfoPopover tokenAddress={address} chain={chain} />
          </HStack>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            {token?.name || pool?.name}
          </Text>
        </VStack>
      </HStack>
      <HStack spacing="8">
        <VStack spacing="xs" alignItems="flex-end">
          {isLoading ? (
            <>
              <Skeleton w="10" h="4" />
              <Skeleton w="10" h="4" />
            </>
          ) : (
            <>
              <Heading fontWeight="bold" as="h6" fontSize="1rem">
                {amount}
              </Heading>
              <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                {usdValue ? toCurrency(usdValue, { abbreviated }) : '-'}
              </Text>
            </>
          )}
        </VStack>
        {customRender && token && customRender(token)}
      </HStack>
    </HStack>
  )
}
