/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
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
  GetPoolEventsDocument,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { balColors, balTheme, tokens } from '@/lib/shared/services/chakra/theme'
import { ButtonGroupOption } from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { ChainSlug, slugToChainMap } from '../../pool.utils'
import { ColorMode } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { ArrowRight } from 'react-feather'

const toolTipTheme = {
  heading: 'font-weight: bold; color: #E5D3BE',
  container: `background: ${balTheme.semanticTokens.colors.background.level3._dark};`,
  text: balTheme.semanticTokens.colors.font.secondary._dark,
}

export const getDefaultPoolChartOptions = (
  theme: ColorMode = 'dark'
): echarts.EChartsCoreOption => {
  return {
    grid: {
      left: '3.5%',
      right: '2.5%',
      top: '7.5%',
      bottom: '10.5%',
      containLabel: false,
    },
    xAxis: {
      show: true,
      type: 'time',
      minorSplitLine: { show: false },
      axisTick: { show: false },
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => {
          return format(new Date(value * 1000), 'MMM d')
        },
        color: tokens.colors[theme].text.secondary,
        opacity: 0.5,
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
      show: true,
      type: 'value',
      axisLine: { show: false },
      minorSplitLine: { show: false },
      splitLine: { show: false },
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => {
          return numeral(value).format('($0,0a)')
        },
        color: tokens.colors[theme].text.secondary,
        opacity: 0.5,
        interval: 'auto',
        showMaxLabel: false,
        showMinLabel: false,
      },
    },
    tooltip: {
      extraCssText: `padding-right:2rem;border: none;${toolTipTheme.container}`,
      show: true,
      formatter: (params: any) => {
        const data = Array.isArray(params) ? params[0] : params
        const timestamp = data.value[0]
        const value = data.value[1]
        const address = data.data[2]
        const tokens: ChartInfoTokens[] | undefined = data.data[3]

        return `
          <div style="padding: none; display: flex; flex-direction: column;${
            toolTipTheme.container
          }">
            <div style="font-size: 0.8rem; font-weight: 500; color: ${
              toolTipTheme.text
            }; display:flex;justify-content:space-between;${toolTipTheme.heading};">
              <span>${data.seriesName}</span>
              <span>${numeral(value).format('($0,0a)')}</span>
            </div>
            <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:0">
              ${tokens?.map(token => {
                return `
                  <div style="color: ${
                    toolTipTheme.text
                  }; display:flex;justify-content:space-between;align-items:center">
                    <img src="${
                      token.token?.logoURI
                    }" style="width: 16px; height: 16px; border-radius: 50%; margin-right: 0.5rem;" />
                    <div>
                      <span>${Number(token.amount).toFixed(2)}</span>
                      <span>${token.token?.symbol}</span>
                    </div>
                  </div>
                `
              })}
            </div>
            <div style="font-size: 0.85rem; font-weight: 500; color: ${toolTipTheme.text};">
              By: ${abbreviateAddress(address)}
            </div>
            <div style="font-size: 0.85rem; font-weight: 500; color: ${toolTipTheme.text};">
              ${format(new Date(timestamp * 1000), 'MMM d')}
            </div>
          </div>
      `
      },
    },
  }
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
      first: 1000,
      poolId,
      chain,
    },
  })
}

export type PoolActivityChartTab = 'all' | 'adds' | 'swaps' | 'removes'

type ChartInfoTokens = {
  token?: GqlToken
  amount: string
}
export type ChartInfo = Record<
  'adds' | 'removes' | 'swaps',
  [number, string, string, ChartInfoTokens[]][]
>
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
  const { theme } = useTheme()
  const { getToken } = useTokens()

  const { id: poolId, variant, chain } = useParams()
  const { pool } = usePool()
  const _chain = slugToChainMap[chain as ChainSlug]

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType || typeof variant !== 'string') return []

    return getPoolActivityTabsList({
      variant: variant as PoolVariant,
      poolType: poolType,
    })
  }, [pool?.type, variant])

  const [activeTab, setActiveTab] = useState<ButtonGroupOption>(tabsList[0])

  const { data: response } = usePoolEvents(poolId as string, _chain)

  const chartData = useMemo(() => {
    if (!response) return { adds: [], removes: [], swaps: [] }
    const { poolEvents: events } = response

    const data = events.reduce(
      (acc: ChartInfo, item) => {
        const { type, timestamp, valueUSD, userAddress } = item

        const usdValue = valueUSD.toString() ?? ''
        const tokens: ChartInfoTokens[] = []

        if (item.__typename === 'GqlPoolJoinExitEventV3') {
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

        if (type === GqlPoolEventType.Join) {
          acc.adds.push([timestamp, usdValue, userAddress, tokens])
        }
        if (type === GqlPoolEventType.Exit) {
          acc.removes.push([timestamp, usdValue, userAddress, tokens])
        }
        if (type === GqlPoolEventType.Swap) {
          acc.swaps.push([timestamp, usdValue, userAddress, tokens])
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
    chartOption: getDefaultPoolChartOptions(theme as ColorMode),
    activeTab,
    setActiveTab,
    tabsList,
    eChartsRef,
  }
}
