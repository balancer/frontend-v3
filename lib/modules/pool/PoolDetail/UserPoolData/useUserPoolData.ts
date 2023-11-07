import { useMemo } from 'react'
import { usePool } from '../../usePool'
import numeral from 'numeral'

export function useUserPoolData() {
  const { pool, loading } = usePool()

  const poolComposition = useMemo(() => {
    if (!pool) return []
    const { tokens } = pool

    // TO_DO add proper token type
    return tokens.map((token: any) => {
      const { symbol, balance, weight } = token
      return {
        symbol: symbol,
        balance: numeral(balance).format('(0,0)'),
        // TO_DO add fiat value
        value: balance,
        // TODO add a real weight and target weight
        weight: numeral(weight).format('(%0,0)'),
      }
    })
  }, [pool])

  const btns = [
    {
      title: 'Add',
      action: 'add',
      variant: 'solid',
    },
    {
      title: 'Remove',
      action: 'remove',
      variant: 'outline',
    },
    {
      title: 'Stake',
      action: 'stake',
      variant: 'outline',
    },
    {
      title: 'Unstake',
      action: 'unstake',
      variant: 'outline',
    },
  ]
  return { btns, poolComposition }
}
