import { Box, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { GqlChain, GqlPoolTokenDisplay } from '@/lib/shared/services/api/generated/graphql'
import { PoolListItem } from '../pool.types'
import { TokenIconStack } from '../../tokens/TokenIconStack'
import { TokenIcon } from '../../tokens/TokenIcon'
import { fNum } from '@/lib/shared/utils/numbers'
import { isStableLike, isWeightedLike } from '../pool.helpers'

function TokenIconOrIconStack({ token, chain }: { token: GqlPoolTokenDisplay; chain: GqlChain }) {
  return token.nestedTokens ? (
    <TokenIconStack tokens={token.nestedTokens} chain={chain} size={20} />
  ) : (
    <TokenIcon chain={chain} address={token.address} size={20} alt={token.symbol} />
  )
}

function WeightedTokenPills({ tokens, chain }: { tokens: GqlPoolTokenDisplay[]; chain: GqlChain }) {
  return (
    <Wrap spacing="xs">
      {tokens.map(token => {
        return (
          <WrapItem
            key={token.address}
            p={['xs', 'sm']}
            pr={[1.5, 'ms']}
            h={['32px', '36px']}
            display="flex"
            alignItems="center"
            bg="background.level2"
            borderRadius="full"
            borderWidth={1}
            borderColor="border.base"
            shadow="sm"
          >
            <HStack gap={['xs', 'sm']}>
              <TokenIconOrIconStack token={token} chain={chain} />
              <HStack gap={['xs', '1.5']}>
                <Text fontWeight="bold" noOfLines={1}>
                  {token.nestedTokens ? token.name : token.symbol}
                </Text>
                <Text fontSize="xs">{fNum('weight', token.weight || '')}</Text>
              </HStack>
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
            h={['32px', '36px']}
            pr="3"
            display="flex"
            alignItems="center"
            pl={isFirstToken(i) ? 2 : 12}
            bg="background.level2"
            borderRadius="full"
            borderWidth={1}
            borderColor="border.base"
            shadow="sm"
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
