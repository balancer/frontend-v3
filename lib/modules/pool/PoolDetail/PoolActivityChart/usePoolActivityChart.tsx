import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import numeral from 'numeral'
import { theme } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { PoolVariant } from '../../pool.types'
import {
  GetPoolJoinsExitsSwapsDocument,
  GqlPoolFilterType,
  GqlPoolJoinExitType,
} from '@/lib/shared/services/api/generated/graphql'
import EChartsReactCore from 'echarts-for-react/lib/core'

const defOptions = {
  grid: {
    left: '0.5%',
    right: '0.5%',
    top: '0%',
    bottom: '0%',
    containLabel: true,
  },
  xAxis: {
    type: 'time',
    minorSplitLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      formatter: (value: number) => {
        return format(new Date(value * 1000), 'MMM d')
      },
      interval: 'auto',
      showMaxLabel: false,
      showMinLabel: false,
    },
    axisPointer: {
      type: 'line',
      label: {
        formatter: (params: any) => {
          return format(new Date(params.value * 1000), 'MMM d')
        },
      },
    },
    axisLine: { show: false },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    minorSplitLine: { show: false },
    splitLine: { show: false },
    splitNumber: 4,
    axisLabel: {
      formatter: (value: number) => {
        return numeral(value).format('($0,0a)')
      },
      interval: 'auto',
      showMaxLabel: false,
      showMinLabel: false,
    },
  },
  tooltip: {
    formatter: (params: any) => {
      const data = Array.isArray(params) ? params[0] : params

      return `
        <div style="display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 14px; font-weight: 500; color: ${
            theme.colors.gray[500]
          }; margin-bottom: 5px;">
            Type: ${data.seriesName}
          </div>
          <div style="font-size: 14px; font-weight: 500; color: ${
            theme.colors.gray[500]
          }; margin-bottom: 5px;">
           Date: ${format(new Date(data.value[0] * 1000), 'MMM d')}
          </div>
          <div style="font-size: 14px; font-weight: 500; color: ${
            theme.colors.gray[500]
          }; margin-bottom: 5px;">
            Value: ${numeral(data.value[1]).format('($0,0a)')}
          </div>
        </div>
      `
    },
  },
}

function getSymbolSize(dataItem?: [number, string]) {
  if (!dataItem) return 0

  const value = Number(dataItem[1])
  if (value < 10000) return 10
  if (value < 100000) return 15
  if (value < 1000000) return 25
  if (value < 10000000) return 45

  return 80
}

export function usePoolJoinsExitsSwaps(poolId: string) {
  return useQuery(GetPoolJoinsExitsSwapsDocument, {
    variables: {
      poolId,
      first: 50,
    },
    notifyOnNetworkStatusChange: true,
  })
}

export enum PoolActivityChartTab {
  ALL = 'all',
  ADDS = 'adds',
  REMOVES = 'removes',
  SWAPS = 'swaps',
}

export interface PoolActivityChartTypeTab {
  value: PoolActivityChartTab
  label: string
}

export function getPoolActivityTabsList({
  variant,
  poolType,
}: {
  variant: PoolVariant
  poolType: GqlPoolFilterType
}): PoolActivityChartTypeTab[] {
  if (poolType === GqlPoolFilterType.LiquidityBootstrapping && variant === PoolVariant.v2) {
    return [
      {
        value: PoolActivityChartTab.ADDS,
        label: 'Adds',
      },
      {
        value: PoolActivityChartTab.REMOVES,
        label: 'Removes',
      },
    ]
  }

  return [
    {
      value: PoolActivityChartTab.ALL,
      label: 'All',
    },
    {
      value: PoolActivityChartTab.ADDS,
      label: 'Adds',
    },
    {
      value: PoolActivityChartTab.REMOVES,
      label: 'Removes',
    },
    {
      value: PoolActivityChartTab.SWAPS,
      label: 'Swaps',
    },
  ]
}

export function usePoolActivityChart() {
  const eChartsRef = useRef<EChartsReactCore | null>(null)

  const { id: poolId, variant } = useParams()
  const { pool } = usePool()

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType || typeof variant !== 'string') return []

    return getPoolActivityTabsList({
      variant: variant as PoolVariant,
      poolType: poolType as GqlPoolFilterType,
    })
  }, [pool?.type, variant])

  const [activeTab, setActiveTab] = useState(tabsList[0]?.value)

  const { data: response } = usePoolJoinsExitsSwaps(poolId as string)

  const chartData = useMemo(() => {
    if (!response) return { adds: [], removes: [], swaps: [] }
    const { joinExits, swaps } = response

    const data = joinExits.reduce(
      (acc: Record<'adds' | 'removes' | 'swaps', [number, string][]>, item) => {
        const { type, timestamp, valueUSD } = item
        const usdValue = valueUSD ?? ''
        if (type === GqlPoolJoinExitType.Join) {
          acc.adds.push([timestamp, usdValue])
        }
        if (type === GqlPoolJoinExitType.Exit) {
          acc.removes.push([timestamp, usdValue])
        }

        return acc
      },
      { adds: [], removes: [], swaps: [] }
    )

    swaps.forEach(item => {
      const { timestamp, valueUSD } = item
      const usdValue = valueUSD.toString()
      data.swaps.push([timestamp, usdValue])
    })

    return data
  }, [response])

  const options = useMemo(() => {
    return {
      joinOption: {
        name: 'Add',
        itemStyle: {
          color: theme.colors.green[500],
        },
        emphasis: {
          focus: 'self',
        },
        symbolSize: getSymbolSize,
        data: chartData.adds,
        type: 'scatter',
      },
      exitOption: {
        name: 'Remove',
        itemStyle: {
          color: theme.colors.red[500],
        },
        emphasis: {
          focus: 'self',
        },
        symbolSize: getSymbolSize,
        data: chartData.removes,
        type: 'scatter',
      },
      swapOption: {
        name: 'Swap',
        itemStyle: {
          color: theme.colors.blue[500],
        },
        emphasis: {
          focus: 'self',
        },
        symbolSize: getSymbolSize,
        data: chartData.swaps,
        type: 'scatter',
      },
    }
  }, [chartData])

  useEffect(() => {
    const instance = eChartsRef.current?.getEchartsInstance()
    if (!instance) return
    const { joinOption, exitOption, swapOption } = options
    if (activeTab === PoolActivityChartTab.ADDS) {
      instance?.setOption({
        series: [{ data: joinOption.data }, { data: [] }, { data: [] }],
      })
    }
    if (activeTab === PoolActivityChartTab.REMOVES) {
      instance?.setOption({
        series: [{ data: [] }, { data: exitOption.data }, { data: [] }],
      })
    }
    if (activeTab === PoolActivityChartTab.SWAPS) {
      instance?.setOption({
        series: [{ data: [] }, { data: [] }, { data: swapOption.data }],
      })
    }
    if (activeTab === PoolActivityChartTab.ALL) {
      instance?.setOption({
        series: [joinOption, exitOption, swapOption],
      })
    }
  }, [activeTab, chartData, options])

  return {
    chartOption: defOptions,
    activeTab,
    setActiveTab,
    tabsList,
    eChartsRef,
  }
}
