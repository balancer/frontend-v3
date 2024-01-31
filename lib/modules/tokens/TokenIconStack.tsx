import { GqlChain, GqlPoolTokenDisplay } from '@/lib/shared/services/api/generated/graphql'
import { Box, HStack, StackProps } from '@chakra-ui/react'
import { TokenIcon } from './TokenIcon'

type Props = {
  tokens: GqlPoolTokenDisplay[]
  chain: GqlChain
  size?: number
}

export function TokenIconStack({ tokens, chain, size = 64, ...rest }: Props & StackProps) {
  const getNestingMargin = () => {
    if (tokens.length > 4) return -10
    return -5
  }

  return (
    <HStack {...rest}>
      {tokens.map((token, i) => (
        <Box
          key={token.address}
          ml={i > 0 ? getNestingMargin() : 0}
          zIndex={9 - i}
          border="2px solid"
          borderColor="background.base"
          borderRadius="100%"
        >
          <TokenIcon
            chain={chain}
            address={token.address}
            size={size}
            alt={token?.symbol || token.address}
          />
        </Box>
      ))}
    </HStack>
  )
}
