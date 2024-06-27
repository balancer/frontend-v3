/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import * as echarts from 'echarts/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { differenceInCalendarDays, format } from 'date-fns'
import { usePool } from '../../PoolProvider'
import { PoolVariant, BaseVariant } from '../../pool.types'
import {
  GqlChain,
  GqlPoolType,
  GqlPoolEventType,
  GetPoolEventsDocument,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { ButtonGroupOption } from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { ChainSlug, slugToChainMap } from '../../pool.utils'
import { ColorMode, useTheme as useChakraTheme } from '@chakra-ui/react'
import { useTheme as useNextTheme } from 'next-themes'
import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'

import {
  getBlockExplorerAddressUrl,
  getBlockExplorerTxUrl,
} from '@/lib/shared/hooks/useBlockExplorer'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { NumberFormatter } from '@/lib/shared/utils/numbers'
import { usePoolEvents } from '../../usePoolEvents'

type ChartInfoTokens = {
  token?: GqlToken
  amount: string
}

export type ChartInfoMetaData = {
  userAddress: string
  tokens: ChartInfoTokens[]
  tx: string
  usdValue: string
}

type ChartEl = [number, string, ChartInfoMetaData]

export type ChartInfo = Record<'adds' | 'removes' | 'swaps', ChartEl[]>

const getDefaultPoolActivityChartOptions = (
  nextTheme: ColorMode = 'dark',
  theme: any, // TODO: type this
  currencyFormatter: NumberFormatter,
  isMobile = false,
  isExpanded = false
): echarts.EChartsCoreOption => {
  const toolTipTheme = {
    heading: 'font-weight: bold; color: #E5D3BE',
    container: `background: ${theme.semanticTokens.colors.background.level3._dark};`,
    text: theme.semanticTokens.colors.font.secondary._dark,
  }

  const colorMode = nextTheme === 'dark' ? '_dark' : 'default'

  return {
    grid: {
      left: !isExpanded ? '2.5%' : isMobile ? '15%' : '5.5%',
      right: '2.5%',
      top: '7.5%',
      bottom: !isExpanded ? '50%' : '10.5%',
      containLabel: false,
    },
    xAxis: {
      show: isExpanded,
      offset: 10,
      type: 'time',
      minorSplitLine: { show: false },
      axisTick: { show: false },
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => {
          return format(new Date(value * 1000), 'MMM d')
        },
        color: theme.semanticTokens.colors.font.primary[colorMode],
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
      show: isExpanded,
      offset: 10,
      type: 'value',
      axisLine: { show: false },
      minorSplitLine: { show: false },
      splitLine: { show: false },
      splitNumber: 3,
      axisLabel: {
        formatter: (value: number) => {
          return currencyFormatter(value)
        },
        color: theme.semanticTokens.colors.font.primary[colorMode],
        opacity: 0.5,
        interval: 'auto',
        showMaxLabel: true,
        showMinLabel: true,
      },
    },
    tooltip: {
      triggerOn: 'mousemove|click',
      enterable: true,
      hideDelay: 300,
      extraCssText: `padding-right:2rem;border: none;${toolTipTheme.container};pointer-events: auto!important`,
      formatter: (params: any) => {
        const data = Array.isArray(params) ? params[0] : params
        const timestamp = data.value[0]
        const metaData = data.data[2] as ChartInfoMetaData
        const userAddress = metaData.userAddress
        const tokens = metaData.tokens.filter(token => {
          if (!token.token) return false
          if (Number(token.amount) === 0) return false
          return true
        }) as ChartInfoTokens[]

        const tx = metaData.tx
        const txLink = getBlockExplorerTxUrl(tx)
        const addressLink = getBlockExplorerAddressUrl(userAddress)
        const arrow = `<svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>`

        return `
          <div style="padding: none; display: flex; flex-direction: column;${
            toolTipTheme.container
          };margin-right:-15px">
            <div style="font-size: 14px; font-weight: 700; color: ${
              toolTipTheme.text
            }; display:flex;justify-content:start;gap:4px;letter-spacing:-0.25px;${
          toolTipTheme.heading
        };">
              <span>${data.seriesName}</span>
              <span>${currencyFormatter(metaData.usdValue)}</span>
            </div>
            <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:0;margin-top:4px">
              ${tokens?.map((token, index) => {
                return `
                  <div style="color: ${
                    toolTipTheme.text
                  }; display:flex;justify-content:start;align-items:center;gap:6px; margin-bottom:${
                  index === tokens.length - 1 ? `4px` : `-20px`
                }">
                    <img src="${
                      token.token?.logoURI
                    }" style="width: 16px; height: 16px; border-radius: 50%; margin-right;letter-spacing:-0.1px" />
                    <div style="text-align:left">
                      <span>${Number(Number(token.amount).toFixed(2)).toLocaleString()}</span>
                      <span>${token.token?.symbol}</span>
                    </div>
                  </div>
                `
              })}
            </div>
            <a style="display:flex;align-items:center;font-size: 0.85rem; font-weight: 500; color: ${
              toolTipTheme.text
            };" href=${addressLink} target="_blank">
              <span style="margin-right:4px;">By: ${abbreviateAddress(userAddress)}</span>
              ${arrow}
            </a>
            <div style="font-size: 0.75rem; line-height:1;font-weight: 500; margin-top:4px; color: ${
              toolTipTheme.text
            };">
                <a style="display:flex;align-items:center;" href=${txLink} target="_blank">
                  <span style="margin-right:4px;">
                    ${format(new Date(timestamp * 1000), 'MMM d, h:mma')
                      .replace('AM', 'am')
                      .replace('PM', 'pm')}
                  </span>
                  ${arrow}
                </a>
            </div>
          </div>
      `
      },
    },
  }
}

function getSymbolSize(dataItem?: ChartEl) {
  if (!dataItem) return 0

  const value = Number(dataItem[2].usdValue)
  if (value < 10000) return 10
  if (value < 100000) return 15
  if (value < 1000000) return 25
  if (value < 10000000) return 45

  return 80
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
  if (poolType === GqlPoolType.LiquidityBootstrapping && variant === BaseVariant.v2) {
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

export function usePoolActivityChart(isExpanded: boolean) {
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const { isMobile } = useBreakpoints()
  const { theme: nextTheme } = useNextTheme()
  const { getToken } = useTokens()
  const { toCurrency } = useCurrency()
  const { id: poolId, variant, chain } = useParams()
  const { pool } = usePool()
  const theme = useChakraTheme()
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

  const { loading, data: response } = usePoolEvents({ poolId: poolId as string, chain: _chain })

  const chartData = useMemo(() => {
    if (!response) return { adds: [], removes: [], swaps: [] }
    const { poolEvents: events } = response

    const data = events.reduce(
      (acc: ChartInfo, item) => {
        const { type, timestamp, valueUSD, userAddress, tx } = item

        const usdValue = valueUSD.toString() ?? ''
        const tokens: ChartInfoTokens[] = []

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

        const chartYAxisValue = isExpanded ? usdValue : '0'

        if (type === GqlPoolEventType.Add) {
          acc.adds.push([timestamp, chartYAxisValue, { userAddress, tokens, usdValue, tx }])
        }
        if (type === GqlPoolEventType.Remove) {
          acc.removes.push([timestamp, chartYAxisValue, { userAddress, tokens, usdValue, tx }])
        }
        if (type === GqlPoolEventType.Swap) {
          acc.swaps.push([timestamp, chartYAxisValue, { userAddress, tokens, usdValue, tx }])
        }

        return acc
      },
      { adds: [], removes: [], swaps: [] }
    )

    return data
  }, [response, isExpanded])

  const options = useMemo(() => {
    return {
      joinOption: {
        name: 'Add',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: theme.semanticTokens.colors.chart.pool.scatter.add.from,
            },
            {
              offset: 1,
              color: theme.semanticTokens.colors.chart.pool.scatter.add.to,
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
              color: theme.semanticTokens.colors.chart.pool.scatter.remove.from,
            },
            {
              offset: 1,
              color: theme.semanticTokens.colors.chart.pool.scatter.remove.to,
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
              color: theme.semanticTokens.colors.chart.pool.scatter.swap.from,
            },
            {
              offset: 1,
              color: theme.semanticTokens.colors.chart.pool.scatter.swap.to,
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

  function getChartDateCaption() {
    try {
      let diffInDays = 0
      const firstAddTimeStamp = chartData.adds[chartData.adds.length - 1]?.[0] ?? 0
      const firstRemoveTimeStamp = chartData.removes[chartData.removes.length - 1]?.[0] ?? 0
      const firstSwapTimeStamp = chartData.swaps[chartData.swaps.length - 1]?.[0] ?? 0

      if (activeTab.value === 'adds' && firstAddTimeStamp) {
        diffInDays = differenceInCalendarDays(new Date(), new Date(firstAddTimeStamp * 1000))
      }

      if (activeTab.value === 'removes' && firstRemoveTimeStamp) {
        const timestamp = firstRemoveTimeStamp
        diffInDays = differenceInCalendarDays(new Date(), new Date(timestamp * 1000))
      }

      if (activeTab.value === 'swaps' && firstSwapTimeStamp) {
        const timestamp = chartData.swaps[chartData.swaps.length - 1][0]
        diffInDays = differenceInCalendarDays(new Date(), new Date(timestamp * 1000))
      }

      if (activeTab.value === 'all') {
        const lastTimestamp = Math.max(firstSwapTimeStamp, firstRemoveTimeStamp, firstAddTimeStamp)
        diffInDays = differenceInCalendarDays(new Date(), new Date(lastTimestamp * 1000))
      }

      return diffInDays > 0 ? `In last ${diffInDays} days` : 'today'
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  function getChartTitle() {
    if (activeTab.value === 'all') {
      return 'transactions'
    }

    return activeTab.value
  }

  const dataSize = useMemo(() => {
    let dataSize = 0

    if (['all', 'adds'].includes(activeTab.value)) {
      dataSize += chartData.adds.length
    }
    if (['all', 'removes'].includes(activeTab.value)) {
      dataSize += chartData.removes.length
    }
    if (['all', 'swaps'].includes(activeTab.value)) {
      dataSize += chartData.swaps.length
    }

    return dataSize
  }, [activeTab, chartData])

  return {
    isLoading: loading,
    chartOption: getDefaultPoolActivityChartOptions(
      nextTheme as ColorMode,
      theme,
      toCurrency,
      isMobile,
      isExpanded
    ),
    activeTab,
    setActiveTab,
    tabsList,
    eChartsRef,
    chartData,
    getChartDateCaption,
    getChartTitle,
    dataSize,
  }
}
