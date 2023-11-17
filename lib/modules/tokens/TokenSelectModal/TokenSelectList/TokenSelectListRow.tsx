'use client'

import { Box, BoxProps, HStack, VStack, Text } from '@chakra-ui/react'
import { TokenIcon } from '../../TokenIcon'
import { TokenAmount } from '../../token.types'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'

type Props = {
  token: GqlToken
  userBalance?: TokenAmount
  isBalancesLoading?: boolean
}

export function TokenSelectListRow({
  token,
  userBalance,
  isBalancesLoading = true,
  ...rest
}: Props & BoxProps) {
  return (
    <Box {...rest}>
      <HStack height="full" spacing="md">
        <HStack height="full" spacing="md">
          <TokenIcon token={token} alt={token.symbol} />
          <VStack height="full" align="start" justify="center" spacing="none">
            <Text>{token.symbol}</Text>
            <Text fontSize="sm">{token.name}</Text>
          </VStack>
        </HStack>
        {/* <VStack>-{userBalance && !isBalancesLoading ? userBalance.formatted : '-'}</VStack> */}
        <VStack>
          <Text>sss</Text>
        </VStack>
      </HStack>
    </Box>
  )
}
