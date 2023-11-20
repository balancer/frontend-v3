import { useMemo } from 'react'
import { GqlPoolToken } from '@/lib/shared/services/api/generated/graphql'
import { tokenFormat, weightFormat } from '@/lib/shared/hooks/useNumbers'
import { usePool } from '../../usePool'

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
          balance: tokenFormat(_token.balance),
          value: 'TBD',
          targetWeight: _token.weight ? weightFormat(_token.weight) : '',
        }
      })
      .filter(Boolean) as CompositionRow[]
  }, [pool])

  return { poolComposition, loading }
}
