import { theme } from '@chakra-ui/react'
import { addMinutes, format } from 'date-fns'
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
import { usePool } from '../../usePool'
import { PoolVariant } from '../../pool.types'
import { NumberFormatter } from '@/lib/shared/utils/numbers'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { balColors, balTheme } from '@/lib/shared/services/chakra/theme'
import numeral from 'numeral'
import { twentyFourHoursInSecs } from '@/lib/shared/hooks/useTime'

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

export const getDefaultPoolChartOptions = (currencyFormatter: NumberFormatter) => ({
  grid: {
    left: '-2.5%',
    right: '2.5%',
    top: '7.5%',
    bottom: '0',
    containLabel: true,
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
        return currencyFormatter(value)
      },
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
              ${numeral(data.value[1]).format('($0,0a)')}
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
  range: GqlPoolSnapshotDataRange = GqlPoolSnapshotDataRange.ThirtyDays
) {
  return useQuery(GetPoolSnapshotsDocument, {
    variables: {
      poolId,
      range,
      chainId: GqlChain.Mainnet,
    },
    notifyOnNetworkStatusChange: true,
  })
}

export function usePoolCharts() {
  const { pool } = usePool()
  const { id: poolId, variant } = useParams()
  const { toCurrency } = useCurrency()

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

    return toCurrency(val)
  }, [data?.snapshots, activeTab, toCurrency])

  const chartData = useMemo(() => {
    const snapshots = data?.snapshots
    if (!snapshots) return []

    let chartArr: (string | number)[][] = []
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

    // add lagging timestamps
    if (chartArr.length < 30) {
      const lastDate = chartArr[chartArr.length - 1][0]
      const days = 30 - chartArr.length

      const timestampsArr: number[] = []
      for (let i = 1; i <= days; i++) {
        const timestamp = Number(lastDate) - i * twentyFourHoursInSecs
        timestampsArr.push(timestamp * 1000)
      }

      const laggingTimestamps = timestampsArr.map(timestamp => [
        addMinutes(timestamp, new Date(timestamp).getTimezoneOffset()).getTime() / 1000,
        '0',
      ])

      chartArr = [...laggingTimestamps, ...chartArr]
    }

    return chartArr
  }, [data?.snapshots, activeTab])

  const defaultChartOptions = getDefaultPoolChartOptions(toCurrency)

  const options = useMemo(() => {
    const activeTabOptions = poolChartTypeOptions[activeTab.value]

    return {
      ...defaultChartOptions,
      series: [
        {
          type: activeTabOptions.type,
          data: chartData,
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
