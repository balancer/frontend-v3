'use client'

import { useQuery } from '@apollo/client'
import * as echarts from 'echarts/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import numeral from 'numeral'
import { usePool } from '../../usePool'
import { PoolVariant } from '../../pool.types'
import {
  GqlChain,
  GqlPoolType,
  GqlPoolEventType,
  GqlPoolEventsDataRange,
  GetPoolEventsDocument,
} from '@/lib/shared/services/api/generated/graphql'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { balColors, balTheme } from '@/lib/shared/services/chakra/theme'
import { ButtonGroupOption } from '@/lib/shared/components/btns/button-group/ButtonGroup'

const toolTipTheme = {
  heading: 'font-weight: bold; color: #E5D3BE',
  container: `background: ${balColors.gray[800]};`,
  text: balColors.gray[400],
}

const defOptions = {
  grid: {
    left: '2.5%',
    right: '2.5%',
    top: '7.5%',
    bottom: '7.5%',
    containLabel: false,
  },
  xAxis: {
    show: false,
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
    show: false,
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
    extraCssText: `padding-right:2rem;border: none;${toolTipTheme.container}`,
    formatter: (params: any) => {
      const data = Array.isArray(params) ? params[0] : params

      return `
        <div style="padding: none; display: flex; flex-direction: column; justify-content: center;${
          toolTipTheme.container
        }">
          <div style="font-size: 1rem; font-weight: 500; color: ${toolTipTheme.text};">
            <h6 style="${toolTipTheme.heading}">${data.seriesName}</h6>
          </div>
          <div style="font-size: 0.85rem; font-weight: 500; color: ${toolTipTheme.text};">
            ${format(new Date(data.value[0] * 1000), 'MMM d')}
          </div>
          <div style="font-size: 14px; font-weight: 500; color: ${toolTipTheme.text};">
            ${numeral(data.value[1]).format('($0,0a)')}
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

function usePoolEvents(poolId: string, chain: GqlChain) {
  return useQuery(GetPoolEventsDocument, {
    variables: {
      poolId,
      chainId: chain,
      typeIn: [GqlPoolEventType.Join, GqlPoolEventType.Exit, GqlPoolEventType.Swap],
      range: GqlPoolEventsDataRange.ThirtyDays,
    },
    notifyOnNetworkStatusChange: true,
  })
}

export type PoolActivityChartTab = 'all' | 'adds' | 'swaps' | 'removes'

export interface PoolActivityChartTypeTab {
  value: string
  label: string
}

export function getPoolActivityTabsList({
  variant,
  poolType,
}: {
  variant: PoolVariant
  poolType: GqlPoolType
}): PoolActivityChartTypeTab[] {
  if (poolType === GqlPoolType.LiquidityBootstrapping && variant === PoolVariant.v2) {
    return [
      {
        value: 'adds',
        label: 'Adds',
      },
      {
        value: 'removes',
        label: 'Removes',
      },
    ]
  }

  return [
    {
      value: 'all',
      label: 'All',
    },
    {
      value: 'adds',
      label: 'Adds',
    },
    {
      value: 'removes',
      label: 'Removes',
    },
    {
      value: 'swaps',
      label: 'Swaps',
    },
  ]
}

export function usePoolActivityChart() {
  const eChartsRef = useRef<EChartsReactCore | null>(null)

  const { id: poolId, variant } = useParams()
  const { pool, chain } = usePool()

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType || typeof variant !== 'string') return []

    return getPoolActivityTabsList({
      variant: variant as PoolVariant,
      poolType: poolType,
    })
  }, [pool?.type, variant])

  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(tabsList[0])

  const { data: response } = usePoolEvents(poolId as string, chain)

  const chartData = useMemo(() => {
    if (!response) return { adds: [], removes: [], swaps: [] }
    const { events } = response

    const data = events.reduce(
      (acc: Record<'adds' | 'removes' | 'swaps', [number, string][]>, item) => {
        const { type, timestamp, valueUSD } = item
        const usdValue = valueUSD.toString() ?? ''
        if (type === GqlPoolEventType.Join) {
          acc.adds.push([timestamp, usdValue])
        }
        if (type === GqlPoolEventType.Exit) {
          acc.removes.push([timestamp, usdValue])
        }
        if (type === GqlPoolEventType.Swap) {
          acc.swaps.push([timestamp, usdValue])
        }

        return acc
      },
      { adds: [], removes: [], swaps: [] }
    )

    return data
  }, [response])

  const options = useMemo(() => {
    return {
      joinOption: {
        name: 'Add',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: balTheme.semanticTokens.colors.chart.pool.scatter.add.from,
            },
            {
              offset: 1,
              color: balTheme.semanticTokens.colors.chart.pool.scatter.add.to,
            },
          ]),
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: balTheme.semanticTokens.colors.chart.pool.scatter.remove.from,
            },
            {
              offset: 1,
              color: balTheme.semanticTokens.colors.chart.pool.scatter.remove.to,
            },
          ]),
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: balTheme.semanticTokens.colors.chart.pool.scatter.swap.from,
            },
            {
              offset: 1,
              color: balTheme.semanticTokens.colors.chart.pool.scatter.swap.to,
            },
          ]),
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

    switch (activeTab.value) {
      case 'adds':
        return instance.setOption({
          series: [{ data: joinOption.data }, { data: [] }, { data: [] }],
        })
      case 'removes':
        return instance.setOption({
          series: [{ data: [] }, { data: exitOption.data }, { data: [] }],
        })
      case 'swaps':
        return instance.setOption({
          series: [{ data: [] }, { data: [] }, { data: swapOption.data }],
        })
      default:
        return instance.setOption({
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
