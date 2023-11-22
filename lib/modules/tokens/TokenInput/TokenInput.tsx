'use client'
import { Box, HStack, Skeleton, Text, forwardRef } from '@chakra-ui/react'
import { BalInput } from '../../../shared/components/inputs/BalInput/BalInput'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import Image from 'next/image'
import { useTokens } from '../useTokens'
import { useTokenBalances } from '../useTokenBalances'
import { tokenFormat, useNumbers } from '@/lib/shared/hooks/useNumbers'
import { TbWallet } from 'react-icons/tb'

type TokenInputSelectorProps = {
  token: GqlToken | undefined
  weight?: string
}

function TokenInputSelector({ token, weight }: TokenInputSelectorProps) {
  return (
    <Box py="xs" px="sm" bg="sand.50" borderRadius="md">
      <HStack>
        {token?.logoURI && <Image src={token?.logoURI} alt={token.symbol} width={24} height={24} />}
        <Text fontWeight="bold">{token?.symbol}</Text>
        {weight && <Text fontWeight="normal">{weight}%</Text>}
      </HStack>
    </Box>
  )
}

type TokenInputFooterProps = {
  token: GqlToken | undefined
}

function TokenInputFooter({ token }: TokenInputFooterProps) {
  const { balanceFor, isBalancesLoading } = useTokenBalances(token ? [token] : [])
  const { usdValueForToken } = useTokens()
  const { toCurrency } = useNumbers()

  const userBalance = token ? balanceFor(token.address)?.formatted || '0' : '0'
  const usdValue = userBalance && token ? usdValueForToken(token, userBalance) : '0'

  return (
    <HStack h="4" w="full" justify="space-between">
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <Text fontSize="sm">{toCurrency(usdValue)}</Text>
      )}
      {isBalancesLoading ? (
        <Skeleton w="12" h="full" />
      ) : (
        <HStack>
          <Text fontSize="sm" color="red.500">
            {tokenFormat(userBalance)}
          </Text>
          <Box color="sand.300">
            <TbWallet />
          </Box>
        </HStack>
      )}
    </HStack>
  )
}

type Props = {
  address: string
  chain: GqlChain | number
  weight?: string
}

export const TokenInput = forwardRef(({ address, chain, weight }: Props, ref) => {
  const { getToken } = useTokens()
  const token = getToken(address, chain)

  const tokenInputSelector = TokenInputSelector({ token, weight })
  const footer = TokenInputFooter({ token })

  return (
    <BalInput ref={ref} placeholder="0.00" footerSlot={footer} rightSlot={tokenInputSelector} />
  )
})
