import numeral from 'numeral'
import { usePool } from '../../usePool'
import { useMemo } from 'react'

export function usePoolStats() {
  const { pool } = usePool()
  const stats = useMemo(() => {
    const data = pool.dynamicData

    if (!data) return []

    return [
      {
        title: 'Pool value',
        value: numeral(data.totalLiquidity).format('($0,0a)'),
      },
      {
        title: 'Volume (24h)',
        value: numeral(data.volume24h).format('($0,0a)'),
      },
      {
        title: 'Fees (24h)',
        value: numeral(data.fees24h).format('($0,0a)'),
      },
      {
        title: 'Apr',
        // TODO: calculate apr
        value: '1%',
      },
    ]
  }, [pool])

  return { stats }
}
