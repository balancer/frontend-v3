'use client'

import { useMemo } from 'react'
import { usePool } from '../../usePool'
import { format } from 'date-fns'
import { DELEGATE_OWNER } from '@/lib/config/app.config'
import { zeroAddress } from 'viem'
import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { upperFirst } from 'lodash'
import { fNum } from '@/lib/shared/utils/numbers'
import { bptUsdValue } from '../../pool.helpers'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

export function useFormattedPoolAttributes() {
  const { pool } = usePool()
  const { toCurrency } = useCurrency()

  const poolOwnerData = useMemo(() => {
    if (!pool) return
    const { owner } = pool
    if (!owner) return

    if (owner === zeroAddress) {
      return { title: 'No owner', link: '' }
    }

    if (owner === DELEGATE_OWNER) {
      return { title: 'Delegate owner', link: '' }
    }

    return {
      title: abbreviateAddress(owner || ''),
      link: '',
    }
  }, [pool])

  const formattedPoolAttributes = useMemo(() => {
    if (!pool) return []
    const { name, symbol, createTime, address, dynamicData, type } = pool

    return [
      {
        title: 'Pool name',
        value: name,
      },
      {
        title: 'Pool symbol',
        value: symbol,
      },
      {
        title: 'Pool type',
        value: upperFirst(type.toLowerCase()),
      },
      {
        title: 'Swap fees',
        value: fNum('feePercent', dynamicData.swapFee),
      },
      {
        title: 'Pool Manager',
        value: 'None',
      },
      poolOwnerData
        ? {
            title: 'Pool Owner',
            value: poolOwnerData.title,
          }
        : null,
      {
        title: 'Contract address',
        value: abbreviateAddress(address),
      },
      {
        title: 'Creation date',
        value: format(createTime * 1000, 'dd MMMM yyyy'),
      },
      {
        title: 'BPT price',
        value: toCurrency(bptUsdValue(pool, '1')),
      },
    ]
  }, [pool, poolOwnerData])

  return formattedPoolAttributes
}
