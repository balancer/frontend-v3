'use client'

import { Box, BoxProps, HStack, VStack, Text } from '@chakra-ui/react'
import { TokenIcon } from '../../TokenIcon'
import { TokenAmount } from '../../token.types'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useTokens } from '../../useTokens'
import { NumberText } from '@/lib/shared/components/typography/NumberText'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { fNum } from '@/lib/shared/utils/numbers'
import { TokenInfoPopover } from '../../TokenInfoPopover'

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
  const { toCurrency } = useCurrency()
  const { usdValueForToken } = useTokens()

  const tokenBalance =
    userBalance && !isBalancesLoading ? fNum('token', userBalance.formatted) : '-'
  const usdValue =
    userBalance && !isBalancesLoading ? usdValueForToken(token, userBalance.formatted) : '0'
  const fiatValue = userBalance && !isBalancesLoading ? toCurrency(usdValue) : '-'

  const boxStyles: BoxProps = {
    bg: active ? 'background.level3' : 'transparent',
    border: '1px solid',
    borderColor: active ? 'border.base' : 'transparent',
    borderRadius: 'md',
    p: 'sm',
    cursor: 'pointer',
    _hover: {
      bg: active ? 'background.level4' : 'background.level1',
    },
    transition: 'all 0.2s ease-in-out',
  }

  return (
    <Box {...boxStyles} {...rest}>
      <HStack height="full" spacing="md" justify="space-between" maxW="full">
        <HStack height="full" spacing="md" maxW="full">
          <TokenIcon address={token.address} chain={token.chain} alt={token.symbol} />
          <VStack height="full" align="start" justify="center" spacing="none" maxW="full">
            <HStack spacing="xs">
              <Text color={active ? 'font.link' : 'font.primary'} fontWeight="bold">
                {token.symbol}
              </Text>
              <Box onClick={e => e.stopPropagation()}>
                <TokenInfoPopover tokenAddress={token.address} chain={token.chain} />
              </Box>
            </HStack>
            <Text
              title={token.name}
              fontSize="sm"
              w="40"
              isTruncated={true}
              color="grayText"
              fontWeight="medium"
            >
              {token.name}
            </Text>
          </VStack>
        </HStack>
        {isConnected && tokenBalance !== '0' && (
          <VStack align="end" justify="center" spacing="none">
            <NumberText
              title={userBalance?.amount.toString()}
              color={active ? 'font.link' : 'font.primary'}
              fontWeight="bold"
            >
              {tokenBalance}
            </NumberText>
            <NumberText fontSize="sm" color="grayText" fontWeight="medium">
              {fiatValue}
            </NumberText>
          </VStack>
        )}
      </HStack>
    </Box>
  )
}
