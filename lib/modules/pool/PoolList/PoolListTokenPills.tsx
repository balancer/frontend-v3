import { Box, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { GqlChain, GqlPoolTokenDisplay } from '@/lib/shared/services/api/generated/graphql'
import { PoolListItem } from '../pool.types'
import { TokenIconStack } from '../../tokens/TokenIconStack'
import { TokenIcon } from '../../tokens/TokenIcon'
import { fNum } from '@/lib/shared/utils/numbers'
import { isStableLike, isWeightedLike } from '../pool.helpers'

function TokenIconOrIconStack({ token, chain }: { token: GqlPoolTokenDisplay; chain: GqlChain }) {
  return token.nestedTokens ? (
    <TokenIconStack tokens={token.nestedTokens} chain={chain} size={24} />
  ) : (
    <TokenIcon chain={chain} address={token.address} size={24} alt={token.symbol} />
  )
}

function WeightedTokenPills({ tokens, chain }: { tokens: GqlPoolTokenDisplay[]; chain: GqlChain }) {
  return (
    <Wrap spacing="xs">
      {tokens.map(token => {
        return (
          <WrapItem
            key={token.address}
            p="2"
            pr="3"
            bg="background.card.level6"
            borderRadius="full"
            borderWidth={2}
            borderColor="background.card.level0"
          >
            <HStack>
              <TokenIconOrIconStack token={token} chain={chain} />
              <Text fontWeight="bold" noOfLines={1}>
                {token.nestedTokens ? token.name : token.symbol}
              </Text>
              <Text fontWeight="light" fontSize="xs">
                {fNum('weight', token.weight || '')}
              </Text>
            </HStack>
          </WrapItem>
        )
      })}
    </Wrap>
  )
}

function StableTokenPills({ tokens, chain }: { tokens: GqlPoolTokenDisplay[]; chain: GqlChain }) {
  const isFirstToken = (index: number) => index === 0
  const zIndices = Array.from({ length: tokens.length }, (_, index) => index).reverse()

  return (
    <HStack spacing={0}>
      {tokens.map((token, i) => {
        return (
          <Box
            key={token.address}
            p="2"
            pr="3"
            pl={isFirstToken(i) ? 2 : 12}
            bg="background.card.level6"
            borderRadius="full"
            borderWidth={2}
            borderColor="background.card.level0"
            ml={isFirstToken(i) ? 0 : -10}
            zIndex={zIndices[i]}
          >
            <HStack>
              <TokenIconOrIconStack token={token} chain={chain} />
              <Text fontWeight="bold" noOfLines={1} maxW="20">
                {token.nestedTokens ? token.name : token.symbol}
              </Text>
            </HStack>
          </Box>
        )
      })}
    </HStack>
  )
}

type Props = {
  pool: PoolListItem
}

export function PoolListTokenPills({ pool }: Props) {
  const shouldUseWeightedPills = isWeightedLike(pool.type)
  const shouldUseStablePills = isStableLike(pool.type)

  if (shouldUseWeightedPills) {
    return <WeightedTokenPills tokens={pool.displayTokens} chain={pool.chain} />
  }

  if (shouldUseStablePills) {
    return <StableTokenPills tokens={pool.displayTokens} chain={pool.chain} />
  }

  return <WeightedTokenPills tokens={pool.displayTokens} chain={pool.chain} />
}
