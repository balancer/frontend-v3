import { ColorMode, theme } from '@chakra-ui/react'
import { differenceInDays, format } from 'date-fns'
import * as echarts from 'echarts/core'
import {
  GetPoolSnapshotsDocument,
  GqlPoolType,
  GqlPoolSnapshotDataRange,
  GqlChain,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePool } from '../../../PoolProvider'
import { PoolVariant } from '../../../pool.types'
import { NumberFormatter } from '@/lib/shared/utils/numbers'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { balColors, balTheme, tokens } from '@/lib/shared/services/chakra/theme'
import { useTheme } from 'next-themes'

const MIN_DISPLAY_PERIOD_DAYS = 30

export enum PoolChartTab {
  VOLUME = 'volume',
  TVL = 'tvl',
  FEES = 'fees',
}

export type PoolChartPeriod = {
  value: GqlPoolSnapshotDataRange
  label: string
}

export const poolChartPeriods = [
  {
    value: GqlPoolSnapshotDataRange.ThirtyDays,
    label: '30d',
  },
  {
    value: GqlPoolSnapshotDataRange.NinetyDays,
    label: '90d',
  },
  {
    value: GqlPoolSnapshotDataRange.OneHundredEightyDays,
    label: '180d',
  },
  {
    value: GqlPoolSnapshotDataRange.AllTime,
    label: 'All time',
  },
]

export interface PoolChartTypeOptions {
  type: 'line' | 'bar'
  color: string | echarts.graphic.LinearGradient
  hoverColor: string
  hoverBorderColor?: string
  areaStyle?: {
    color: string | echarts.graphic.LinearGradient
  }
}

export interface PoolChartTypeTab {
  value: PoolChartTab
  label: string
}

export const poolChartTypeOptions: Record<PoolChartTab, PoolChartTypeOptions> = {
  [PoolChartTab.VOLUME]: {
    type: 'bar',
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: balTheme.semanticTokens.colors.chart.pool.bar.volume.from,
      },
      {
        offset: 1,
        color: balTheme.semanticTokens.colors.chart.pool.bar.volume.to,
      },
    ]),
    hoverColor: theme.colors.pink[500],
  },
  [PoolChartTab.TVL]: {
    type: 'line',
    color: theme.colors.blue[600],
    hoverBorderColor: theme.colors.pink[500],
    hoverColor: theme.colors.gray[900],
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(14, 165, 233, 0.08)',
        },
        {
          offset: 1,
          color: 'rgba(68, 9, 236, 0)',
        },
      ]),
    },
  },
  [PoolChartTab.FEES]: {
    type: 'bar',
    color: theme.colors.yellow[400],
    hoverColor: theme.colors.pink[500],
  },
}

const toolTipTheme = {
  heading: 'font-weight: bold; color: #E5D3BE',
  container: `background: ${balColors.gray[800]};`,
  text: balColors.gray[400],
}

const dataRangeToDaysMap: { [key in GqlPoolSnapshotDataRange]?: number } = {
  [GqlPoolSnapshotDataRange.ThirtyDays]: 30,
  [GqlPoolSnapshotDataRange.NinetyDays]: 90,
  [GqlPoolSnapshotDataRange.OneHundredEightyDays]: 180,
}

const getDefaultPoolChartOptions = (
  currencyFormatter: NumberFormatter,
  theme: ColorMode = 'dark'
) => ({
  grid: {
    left: '1.5%',
    right: '2.5%',
    top: '7.5%',
    bottom: '0',
    containLabel: true,
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
      interval: 0,
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
        return currencyFormatter(value)
      },
      color: tokens.colors[theme].text.secondary,
      opacity: 0.5,
      interval: 'auto',
      showMaxLabel: false,
      showMinLabel: false,
    },
  },

  tooltip: {
    show: true,
    showContent: true,
    trigger: 'axis',
    confine: true,
    axisPointer: {
      animation: false,
      type: 'shadow',
      label: {
        show: false,
      },
    },
    extraCssText: `padding-right:2rem;border: none;${toolTipTheme.container}`,
    formatter: (params: any) => {
      const data = Array.isArray(params) ? params[0] : params
      return `
          <div style="padding: none; display: flex; flex-direction: column; justify-content: center;${
            toolTipTheme.container
          }">
            <div style="font-size: 0.85rem; font-weight: 500; color: ${toolTipTheme.text};">
              ${format(new Date(data.value[0] * 1000), 'MMM d')}
            </div>
            <div style="font-size: 14px; font-weight: 500; color: ${toolTipTheme.text};">
              ${currencyFormatter(data.value[1])}
            </div>
          </div>
        `
    },
  },
})

export function getPoolTabsList({
  variant,
  poolType,
}: {
  variant: PoolVariant
  poolType: GqlPoolType
}): PoolChartTypeTab[] {
  if (poolType === GqlPoolType.LiquidityBootstrapping && variant === PoolVariant.v2) {
    return [
      {
        value: PoolChartTab.VOLUME,
        label: 'Volume',
      },
      {
        value: PoolChartTab.TVL,
        label: 'TVL',
      },
    ]
  }

  return [
    {
      value: PoolChartTab.VOLUME,
      label: 'Volume',
    },
    {
      value: PoolChartTab.TVL,
      label: 'TVL',
    },
    {
      value: PoolChartTab.FEES,
      label: 'Fees',
    },
  ]
}

export function usePoolSnapshots(
  poolId: string,
  chainId: GqlChain,
  range: GqlPoolSnapshotDataRange = GqlPoolSnapshotDataRange.ThirtyDays
) {
  return useQuery(GetPoolSnapshotsDocument, {
    variables: {
      poolId,
      range,
      chainId,
    },
    notifyOnNetworkStatusChange: true,
  })
}

export function usePoolCharts() {
  const { pool } = usePool()
  const { id: poolId, variant } = useParams()
  const { toCurrency } = useCurrency()
  const { theme } = useTheme()

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType || typeof variant !== 'string') return []

    return getPoolTabsList({
      variant: variant as PoolVariant,
      poolType: poolType,
    })
  }, [pool?.type, variant])

  const [activeTab, setActiveTab] = useState(tabsList[0])
  const [chartValue, setChartValue] = useState(0)
  const [chartDate, setChartDate] = useState('')
  const [activePeriod, setActivePeriod] = useState(poolChartPeriods[0])

  const { data, loading: isLoadingSnapshots } = usePoolSnapshots(
    poolId as string,
    pool.chain,
    activePeriod.value
  )

  const isLoading = isLoadingSnapshots

  const chartValueSum = useMemo(() => {
    if (!data?.snapshots) return null

    let val = 0

    if (activeTab.value === PoolChartTab.TVL) {
      val = Number(data?.snapshots[data?.snapshots.length - 1]?.totalLiquidity)
    }

    if (activeTab.value === PoolChartTab.FEES) {
      val = data?.snapshots.reduce((acc, snapshot) => {
        return (acc += Number(snapshot.fees24h))
      }, 0)
    }

    if (activeTab.value === PoolChartTab.VOLUME) {
      val = data?.snapshots.reduce((acc, snapshot) => {
        return (acc += Number(snapshot.totalLiquidity))
      }, 0)
    }

    return toCurrency(val, { abbreviated: false })
  }, [data?.snapshots, activeTab, toCurrency])

  const chartData = useMemo(() => {
    const snapshots = data?.snapshots
    if (!snapshots) return []

    let chartArr: [number, string][] = []
    if (activeTab.value === PoolChartTab.TVL) {
      chartArr = snapshots.map(snapshot => {
        return [snapshot.timestamp, snapshot.totalLiquidity]
      })
    }

    if (activeTab.value === PoolChartTab.FEES) {
      chartArr = snapshots.map(snapshot => {
        return [snapshot.timestamp, snapshot.fees24h]
      })
    }
    if (activeTab.value === PoolChartTab.VOLUME) {
      chartArr = snapshots.map(snapshot => {
        return [snapshot.timestamp, snapshot.volume24h]
      })
    }
    return chartArr
  }, [data?.snapshots, activeTab])

  const processedChartData = useMemo(() => {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const lastChartDataEl = chartData[chartData.length - 1]
    const processedElements: [number, string][] = []
    const isSelectedTabTVL = activeTab.value === PoolChartTab.TVL

    const minDataDate = lastChartDataEl ? Number(lastChartDataEl[0]) * 1000 : today.getTime()
    const daysSinceMinDataDate = differenceInDays(today, new Date(minDataDate))
    const initialTotalLiquidity = isSelectedTabTVL
      ? lastChartDataEl
        ? lastChartDataEl[1]
        : pool.dynamicData.totalLiquidity
      : undefined

    const iterateTo =
      activePeriod.value in dataRangeToDaysMap
        ? dataRangeToDaysMap[activePeriod.value]!
        : daysSinceMinDataDate > MIN_DISPLAY_PERIOD_DAYS
        ? daysSinceMinDataDate
        : MIN_DISPLAY_PERIOD_DAYS

    for (let i = 0; i < iterateTo; i++) {
      const currentDay = new Date(today)
      currentDay.setUTCDate(today.getUTCDate() - i)
      const timestamp = currentDay.getTime() / 1000

      // If the active tab is TVL, we check if there is enough data to display
      // and if not, add current TVL to the last item
      // and fill start of the selected range with initialTotalLiquidity
      if (activeTab.value === PoolChartTab.TVL) {
        if (i === 0) {
          const existingEntry = chartData.find(item => item[0] === timestamp)

          if (existingEntry) {
            processedElements.push(existingEntry)
          } else {
            processedElements.push([timestamp, pool.dynamicData.totalLiquidity])
          }
        } else if (i === iterateTo - 1) {
          const existingEntry = chartData.find(item => item[0] === timestamp)

          if (existingEntry) {
            processedElements.push(existingEntry)
          } else {
            processedElements.push([timestamp, initialTotalLiquidity!])
          }
        } else {
          const existingEntry = chartData.find(item => item[0] === timestamp)

          if (existingEntry) {
            processedElements.push(existingEntry)
          }
        }

        continue
      }

      // If the active tab is not TVL, we check if there is enough data to display
      // for each day and if not, add 0 to days without data
      if (chartData.some(item => item[0] === timestamp)) {
        const existingEntry = chartData.find(item => item[0] === timestamp)!
        processedElements.push(existingEntry)
      } else {
        processedElements.push([timestamp, '0'])
      }
    }

    return processedElements
  }, [activePeriod.value, activeTab.value, chartData, pool.dynamicData.totalLiquidity])

  const defaultChartOptions = getDefaultPoolChartOptions(toCurrency, theme as 'light' | 'dark')

  const options = useMemo(() => {
    const activeTabOptions = poolChartTypeOptions[activeTab.value]

    return {
      ...defaultChartOptions,
      series: [
        {
          type: activeTabOptions.type,
          data: processedChartData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: activeTabOptions.color,
            borderRadius: 100,
          },
          emphasis: {
            itemStyle: {
              color: activeTabOptions.hoverColor,
              borderColor: activeTabOptions.hoverBorderColor,
            },
          },
          areaStyle: activeTabOptions.areaStyle,
          animationEasing: function (k: number) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k)
          },
        },
      ],
    }
  }, [chartData, activeTab, defaultChartOptions])

  const handleAxisMoved = useCallback(
    ({ dataIndex }: { dataIndex: number }) => {
      const chartHoverValue = chartData?.[dataIndex]?.[1]
      const chartHoverDate = chartData?.[dataIndex]?.[0]
      if (!chartHoverValue || !chartHoverDate) return

      setChartValue(Number(chartHoverValue))
      setChartDate(format(new Date(Number(chartHoverDate) * 1000), 'dd MMM yyyy'))
    },
    [chartData]
  )

  const handleMouseLeave = useCallback(() => {
    const lastChartData = chartData?.[chartData.length - 1]
    if (!lastChartData) return

    setChartValue(Number(lastChartData?.[1]))
    setChartDate(format(new Date(Number(lastChartData?.[0]) * 1000), 'dd MMM yyyy'))
  }, [chartData])

  return {
    isLoading,
    activeTab,
    setActiveTab,
    activePeriod,
    setActivePeriod,
    chartValue,
    chartDate,
    options,
    handleAxisMoved,
    handleMouseLeave,
    chartData,
    tabsList,
    chartValueSum,
  }
}
