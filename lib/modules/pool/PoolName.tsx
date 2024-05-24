import { fNum } from '@/lib/shared/utils/numbers'
import { PoolListItem } from './pool.types'
import { HStack, Text, TextProps } from '@chakra-ui/react'
import { FeaturedPool, Pool } from './PoolProvider'

export function PoolName({
  pool,
  ...rest
}: { pool: PoolListItem | Pool | FeaturedPool } & TextProps) {
  const displayTokens = pool.displayTokens

  // TODO: We may need a more complex conditional for choosing when to display
  // the API provided name over constructing one from the tokens.
  // if (pool.name) {
  //   return <Text {...rest}>{pool.name}</Text>
  // }

  return (
    <HStack alignItems="center" justify="start">
      {displayTokens.map((token, idx) => {
        return (
          <HStack key={token.address} alignItems="center" justify="start">
            <Text as="span" fontWeight="bold" {...rest}>
              {token.nestedTokens ? token.name : token.symbol}
              {token.weight && ` ${fNum('weight', token.weight || '')}`}
            </Text>
            <Text {...rest}>{idx <= displayTokens.length - 2 && '/'}</Text>
          </HStack>
        )
      })}
    </HStack>
  )
}
