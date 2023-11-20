import { useMemo } from 'react'
import { usePool } from '@/lib/modules/pool/usePool'
import { format } from 'date-fns'
import { DELEGATE_OWNER } from '@/lib/config/app.config'
import { zeroAddress } from 'viem'
import { shortenLabel } from '@/lib/shared/utils/addresses'
import { feePercentFormat } from '@/lib/shared/hooks/useNumbers'

export function usePoolInfo() {
  const { pool } = usePool()

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
      title: shortenLabel(owner || ''),
      link: '',
    }
  }, [pool])

  const poolDetails = useMemo(() => {
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
        value: type,
      },
      {
        title: 'Swap fees',
        value: feePercentFormat(dynamicData.swapFee),
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
        value: shortenLabel(address),
      },
      {
        title: 'Creation date',
        value: format(createTime * 1000, 'dd MMMM yyyy'),
      },
    ]
  }, [pool, poolOwnerData])

  return {
    poolDetails,
  }
}
