import { fNum } from '@/lib/shared/utils/numbers'
import { PoolListItem } from './pool.types'
import { Text, TextProps } from '@chakra-ui/react'
import { GqlPoolUnion } from '@/lib/shared/services/api/generated/graphql'

export function PoolName({ pool, ...rest }: { pool: PoolListItem | GqlPoolUnion } & TextProps) {
  const displayTokens = pool.displayTokens

  // TODO: We may need a more complex conditional for choosing when to display
  // the API provided name over constructing one from the tokens.
  if (pool.name) {
    return <Text {...rest}>{pool.name}</Text>
  }

  return (
    <Text {...rest}>
      {displayTokens.map((token, idx) => {
        return (
          <span key={token.address}>
            {token.nestedTokens ? token.name : token.symbol}
            {token.weight && ` ${fNum('weight', token.weight || '')}`}
            {idx <= displayTokens.length - 2 && ' / '}
          </span>
        )
      })}
    </Text>
  )
}
