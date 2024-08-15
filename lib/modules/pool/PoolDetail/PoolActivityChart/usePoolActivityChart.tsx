/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import * as echarts from 'echarts/core'
import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { ChainSlug, slugToChainMap } from '../../pool.utils'
import { ColorMode, useTheme as useChakraTheme } from '@chakra-ui/react'
import { useTheme as useNextTheme } from 'next-themes'
import { abbreviateAddress } from '@/lib/shared/utils/addresses'
import {
  getBlockExplorerAddressUrl,
  getBlockExplorerTxUrl,
} from '@/lib/shared/hooks/useBlockExplorer'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { NumberFormatter } from '@/lib/shared/utils/numbers'
import {
  PoolActivityMetaData,
  PoolActivityTokens,
  PoolActivityEl,
  usePoolActivity,
} from '../PoolActivity/usePoolActivity'

const getDefaultPoolActivityChartOptions = (
  nextTheme: ColorMode = 'dark',
  theme: any, // TODO: type this
  currencyFormatter: NumberFormatter,
  isMobile = false,
  is2xl = false,
  isExpanded = false,
  chain: GqlChain
): echarts.EChartsCoreOption => {
  const toolTipTheme = {
    heading: 'font-weight: bold; color: #E5D3BE',
    container: `background: ${theme.semanticTokens.colors.background.level3._dark};`,
    text: theme.semanticTokens.colors.font.secondary._dark,
  }

  const colorMode = nextTheme === 'dark' ? '_dark' : 'default'

  return {
    grid: {
      left: !isExpanded ? '2.5%' : isMobile ? '15%' : '60',
      right: '10',
      top: '7.5%',
      bottom: !isExpanded ? '50%' : '10.5%',
      containLabel: false,
    },
    xAxis: {
      show: isExpanded,
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
      confine: is2xl ? false : true,
      enterable: true,
      hideDelay: 300,
      position: function (point: number[]) {
        return [point[0] + 5, point[1] - 5]
      },
      extraCssText: `padding-right:2rem;border: none;${toolTipTheme.container};pointer-events: auto!important`,
      formatter: (params: any) => {
        const data = Array.isArray(params) ? params[0] : params
        const timestamp = data.value[0]
        const metaData = data.data[2] as PoolActivityMetaData
        const userAddress = metaData.userAddress
        const tokens = metaData.tokens.filter(token => {
          if (!token.token) return false
          if (Number(token.amount) === 0) return false
          return true
        }) as PoolActivityTokens[]

        const tx = metaData.tx
        const txLink = getBlockExplorerTxUrl(tx, chain)
        const addressLink = getBlockExplorerAddressUrl(userAddress, chain)
        const arrow = `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="none"><path stroke="#718096" stroke-linecap="round" stroke-linejoin="round" d="M2 1h6v6M1 8l7-7"/></svg>`

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
            <a style="width:100%;display:flex;align-items:center;justify-content:space-between;font-size: 0.75rem; font-weight: 500; color: ${
              toolTipTheme.text
            };" href=${txLink} target="_blank">
            <span style="margin-right:4px;">
                    Tx: ${format(new Date(timestamp * 1000), 'MMM d, h:mma')
                      .replace('AM', 'am')
                      .replace('PM', 'pm')}
                  </span>
              
              ${arrow}
            </a>
            <div style="width:100%;display:flex;align-items:center;justify-content:space-between;font-size: 0.75rem; line-height:1;font-weight: 500; margin-top:4px; color: ${
              toolTipTheme.text
            };">
                <a style="display:flex;align-items:center;" href=${addressLink} target="_blank">
                  <span style="font-size: 0.75rem; margin-right:4px;">By: ${abbreviateAddress(
                    userAddress
                  )}</span>
                  ${arrow}
                </a>
            </div>
          </div>
      `
      },
    },
  }
}

function getSymbolSize(dataItem?: PoolActivityEl) {
  if (!dataItem) return 0

  const value = Number(dataItem[2].usdValue)
  if (value < 10000) return 10
  if (value < 100000) return 15
  if (value < 1000000) return 25
  if (value < 10000000) return 45

  return 80
}

export function usePoolActivityChart(isExpanded: boolean) {
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const { isMobile, is2xl } = useBreakpoints()
  const { theme: nextTheme } = useNextTheme()
  const { toCurrency } = useCurrency()
  const { chain } = useParams()
  const theme = useChakraTheme()
  const { poolActivityData, activeTab } = usePoolActivity()
  const _chain = slugToChainMap[chain as ChainSlug]
  const chartHeight = isExpanded ? 300 : 90

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
          scale: 1.5,
        },
        symbolSize: getSymbolSize,
        data: poolActivityData.adds,
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
          scale: 1.5,
        },
        symbolSize: getSymbolSize,
        data: poolActivityData.removes,
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
          scale: 1.5,
        },
        symbolSize: getSymbolSize,
        data: poolActivityData.swaps,
        type: 'scatter',
      },
    }
  }, [poolActivityData])

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
  }, [activeTab, poolActivityData, options])

  return {
    chartOption: getDefaultPoolActivityChartOptions(
      nextTheme as ColorMode,
      theme,
      toCurrency,
      isMobile,
      is2xl,
      isExpanded,
      _chain
    ),
    eChartsRef,
    chartHeight,
  }
}
