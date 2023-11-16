'use client'

import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Box, BoxProps, HStack, VStack, Text } from '@chakra-ui/react'
import { TokenIcon } from '../../TokenIcon'

type Props = {
  token: GqlToken
}

export function TokenSelectListRow({ token, ...rest }: Props & BoxProps) {
  return (
    <Box {...rest}>
      <HStack height="full" spacing="md">
        <TokenIcon token={token} alt={token.symbol} />
        <VStack height="full" align="start" justify="center" spacing="none">
          <Text>{token.symbol}</Text>
          <Text fontSize="sm">{token.name}</Text>
        </VStack>
      </HStack>
    </Box>
  )
}
