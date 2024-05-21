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
      return {
        title: 'No owner',
        link: '',
        swapFeeText: 'non-editable',
        attributeImmutabilityText: '',
      }
    }

    if (owner === DELEGATE_OWNER) {
      return {
        title: 'Delegate owner',
        link: '',
        swapFeeText: 'editable by governance',
        attributeImmutabilityText: ' except for swap fees editable by governance',
      }
    }

    return {
      title: abbreviateAddress(owner || ''),
      link: '',
      swapFeeText: 'editable by pool owner',
      attributeImmutabilityText: ' except for swap fees editable by the pool owner',
    }
  }, [pool])

  const formattedPoolAttributes = useMemo(() => {
    if (!pool) return []
    const { name, symbol, createTime, dynamicData, type } = pool

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
        title: 'Protocol version',
        value: `Balancer V${pool.vaultVersion}`,
      },
      {
        title: 'Swap fees',
        value: `${fNum('feePercent', dynamicData.swapFee)} (${poolOwnerData?.swapFeeText})`,
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
        title: 'Attribute immutability',
        value: `Immutable${poolOwnerData?.attributeImmutabilityText}`,
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
