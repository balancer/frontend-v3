import { useMemo } from 'react'
import { usePool } from '../../usePool'
import { GqlPoolToken } from '@/lib/shared/services/api/generated/graphql'
import { fNum } from '@/lib/shared/utils/numbers'

type CompositionRow = {
  symbol: string
  balance: string
  value: string
  targetWeight: string
}

export function usePoolComposition() {
  const { pool, loading } = usePool()

  const poolComposition = useMemo(() => {
    return pool.tokens
      .map(token => {
        if (!token) return null
        const _token = token as GqlPoolToken

        return {
          symbol: _token.symbol,
          balance: fNum('token', _token.balance),
          value: 'TBD',
          targetWeight: _token.weight ? fNum('weight', _token.weight) : '',
        }
      })
      .filter(Boolean) as CompositionRow[]
  }, [pool])

  return { poolComposition, loading }
}
