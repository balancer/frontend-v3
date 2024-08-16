import { ButtonGroupOption } from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { BaseVariant, PoolVariant } from '../../pool.types'
import { usePool } from '../../PoolProvider'
import {
  GqlPoolEventType,
  GqlPoolType,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import { usePoolEvents } from '../../usePoolEvents'
import { slugToChainMap, ChainSlug } from '../../pool.utils'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'
import { differenceInCalendarDays } from 'date-fns'
import { fNum } from '@/lib/shared/utils/numbers'
import { PaginationState } from '@/lib/shared/components/pagination/pagination.types'

export type PoolActivityTokens = {
  token?: GqlToken
  amount: string
}

export type PoolActivityMetaData = {
  userAddress: string
  tokens: PoolActivityTokens[]
  tx: string
  usdValue: string
  action: 'swap' | 'add' | 'remove'
}

export type PoolActivityEl = [number, string, PoolActivityMetaData]
export type PoolActivity = Record<'adds' | 'removes' | 'swaps', PoolActivityEl[]>
export type PoolActivityTab = 'all' | 'adds' | 'swaps' | 'removes'

export interface PoolActivityTypeTab {
  value: string
  label: string
}

export function getPoolActivityTabsList({
  variant,
  poolType,
}: {
  variant: PoolVariant
  poolType: GqlPoolType
}): PoolActivityTypeTab[] {
  const defaultTabs = [
    {
      value: 'adds',
      label: 'Adds',
    },
    {
      value: 'removes',
      label: 'Removes',
    },
  ]
  if (poolType === GqlPoolType.LiquidityBootstrapping && variant === BaseVariant.v2) {
    return defaultTabs
  }

  return [
    {
      value: 'all',
      label: 'All',
    },
    ...defaultTabs,
    {
      value: 'swaps',
      label: 'Swaps',
    },
  ]
}

export function usePoolActivity() {
  const { id: poolId, variant, chain } = useParams()
  const { pool } = usePool()
  const _chain = slugToChainMap[chain as ChainSlug]
  const { getToken } = useTokens()

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType || typeof variant !== 'string') return []

    return getPoolActivityTabsList({
      variant: variant as PoolVariant,
      poolType: poolType,
    })
  }, [pool?.type, variant])

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(tabsList[0])

  function getTitle() {
    if (activeTab.value === 'all') {
      return 'transactions'
    }

    return activeTab.value
  }

  const { loading, data: response } = usePoolEvents({
    poolIdIn: [poolId] as string[],
    chainIn: [_chain],
  })

  const poolActivityData = useMemo(() => {
    if (!response) return { adds: [], removes: [], swaps: [] }
    const { poolEvents: events } = response

    const data = events.reduce(
      (acc: PoolActivity, item) => {
        const { type, timestamp, valueUSD, userAddress, tx } = item

        const usdValue = valueUSD.toString() ?? ''
        const tokens: PoolActivityTokens[] = []

        if (item.__typename === 'GqlPoolAddRemoveEventV3') {
          item.tokens.forEach(token => {
            tokens.push({
              token: getToken(token.address, _chain),
              amount: token.amount,
            })
          })
        }

        if (item.__typename === 'GqlPoolSwapEventV3') {
          tokens.push({
            token: getToken(item.tokenIn.address, _chain),
            amount: item.tokenIn.amount,
          })
          tokens.push({
            token: getToken(item.tokenOut.address, _chain),
            amount: item.tokenOut.amount,
          })
        }

        const elToPush = [
          timestamp,
          isExpanded ? '0' : usdValue,
          { userAddress, tokens, usdValue, tx, action: 'swap' }, // action will be overwritten again below
        ] as PoolActivityEl

        switch (type) {
          case GqlPoolEventType.Add:
            acc.adds.push([elToPush[0], elToPush[1], { ...elToPush[2], action: 'add' }])
            break
          case GqlPoolEventType.Remove:
            acc.removes.push([elToPush[0], elToPush[1], { ...elToPush[2], action: 'remove' }])
            break
          case GqlPoolEventType.Swap:
            acc.swaps.push([elToPush[0], elToPush[1], { ...elToPush[2], action: 'swap' }])
            break
        }

        return acc
      },
      { adds: [], removes: [], swaps: [] }
    )

    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isExpanded])

  const [first, setFirst] = useState(10)
  const [skip, setSkip] = useState(0)

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: skip / first,
      pageSize: first,
    }),
    [skip, first]
  )

  function setPagination(newPagination: PaginationState) {
    setFirst(newPagination.pageSize)
    setSkip(newPagination.pageIndex * newPagination.pageSize)
  }

  const dataSize = useMemo(() => {
    let dataSize = 0

    if (['all', 'adds'].includes(activeTab.value)) {
      dataSize += poolActivityData.adds.length
    }
    if (['all', 'removes'].includes(activeTab.value)) {
      dataSize += poolActivityData.removes.length
    }
    if (['all', 'swaps'].includes(activeTab.value)) {
      dataSize += poolActivityData.swaps.length
    }

    return dataSize
  }, [activeTab, poolActivityData])

  function getDateCaption() {
    try {
      let diffInDays = 0
      const firstAddTimeStamp = poolActivityData.adds[poolActivityData.adds.length - 1]?.[0] ?? 0
      const firstRemoveTimeStamp =
        poolActivityData.removes[poolActivityData.removes.length - 1]?.[0] ?? 0
      const firstSwapTimeStamp = poolActivityData.swaps[poolActivityData.swaps.length - 1]?.[0] ?? 0

      if (activeTab.value === 'adds' && firstAddTimeStamp) {
        diffInDays = differenceInCalendarDays(new Date(), new Date(firstAddTimeStamp * 1000))
      }

      if (activeTab.value === 'removes' && firstRemoveTimeStamp) {
        const timestamp = firstRemoveTimeStamp
        diffInDays = differenceInCalendarDays(new Date(), new Date(timestamp * 1000))
      }

      if (activeTab.value === 'swaps' && firstSwapTimeStamp) {
        const timestamp = poolActivityData.swaps[poolActivityData.swaps.length - 1][0]
        diffInDays = differenceInCalendarDays(new Date(), new Date(timestamp * 1000))
      }

      if (activeTab.value === 'all') {
        const timestamps = [firstAddTimeStamp, firstRemoveTimeStamp, firstSwapTimeStamp].filter(
          Boolean
        )
        const lastTimestamp = Math.min(...timestamps)
        diffInDays = differenceInCalendarDays(new Date(), new Date(lastTimestamp * 1000))
      }

      return diffInDays > 0 ? `in last ${diffInDays} days` : 'today'
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  const allPoolEvents = useMemo(() => {
    const events = [
      ...poolActivityData.adds,
      ...poolActivityData.removes,
      ...poolActivityData.swaps,
    ].sort((a, b) => b[0] - a[0])

    return events.slice(
      pagination.pageIndex * pagination.pageSize,
      pagination.pageSize * (pagination.pageIndex + 1)
    )
  }, [poolActivityData, pagination])

  return {
    isLoading: loading,
    isExpanded,
    dataSize,
    activeTab,
    tabsList,
    poolActivityData,
    transactionsLabel: `${fNum('integer', dataSize)} ${getTitle()} ${getDateCaption()}`,
    pagination,
    allPoolEvents,
    count: response?.poolEvents.length ?? 0,
    setActiveTab,
    setIsExpanded,
    getTitle,
    getDateCaption,
    setPagination,
  }
}
