'use client'

import { Box, BoxProps, HStack, VStack, Text, TextProps } from '@chakra-ui/react'
import { TokenIcon } from '../../TokenIcon'
import { TokenAmount } from '../../token.types'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { tokenFormat, useNumbers } from '@/lib/shared/hooks/useNumbers'
import { useTokens } from '../../useTokens'

type Props = {
  token: GqlToken
  userBalance?: TokenAmount
  isBalancesLoading?: boolean
  active?: boolean
}

export function TokenSelectListRow({
  token,
  userBalance,
  isBalancesLoading = true,
  active = false,
  ...rest
}: Props & BoxProps) {
  const { isConnected } = useUserAccount()
  const { toCurrency } = useNumbers()
  const { usdValueForToken } = useTokens()

  const tokenBalance = userBalance && !isBalancesLoading ? tokenFormat(userBalance.formatted) : '-'
  const usdValue =
    userBalance && !isBalancesLoading ? usdValueForToken(token, userBalance.formatted) : '0'
  const fiatValue = userBalance && !isBalancesLoading ? toCurrency(usdValue) : '-'

  const boxStyles: BoxProps = {
    bg: active ? 'background.card.level5' : 'transparent',
    shadow: active ? 'md' : 'none',
    borderRadius: 'md',
    p: 'sm',
    cursor: 'pointer',
    _hover: {
      bg: active ? 'background.card.level6' : 'background.card.level4',
    },
    transition: 'all 0.2s ease-in-out',
  }

  const textStyles: TextProps = {
    color: active ? 'blue.500' : 'inherit',
  }

  return (
    <Box {...boxStyles} {...rest}>
      <HStack height="full" spacing="md" justify="space-between" maxW="full">
        <HStack height="full" spacing="md" maxW="full">
          <TokenIcon token={token} alt={token.symbol} />
          <VStack height="full" align="start" justify="center" spacing="none" maxW="full">
            <Text {...textStyles}>{token.symbol}</Text>
            <Text title={token.name} fontSize="sm" w="40" isTruncated={true} {...textStyles}>
              {token.name}
            </Text>
          </VStack>
        </HStack>
        {isConnected && (
          <VStack align="end" justify="center" spacing="none">
            <Text
              title={userBalance?.amount.toString()}
              style={{ fontVariantNumeric: 'tabular-nums ' }}
              {...textStyles}
            >
              {tokenBalance}
            </Text>
            <Text fontSize="sm" style={{ fontVariantNumeric: 'tabular-nums ' }} {...textStyles}>
              {fiatValue}
            </Text>
          </VStack>
        )}
      </HStack>
    </Box>
  )
}
