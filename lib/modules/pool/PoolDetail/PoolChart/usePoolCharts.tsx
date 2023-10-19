import { theme } from '@chakra-ui/react'
import { format } from 'date-fns'
import * as echarts from 'echarts/core'
import numeral from 'numeral'
import {
  GetPoolSnapshotsDocument,
  GqlPoolSnapshotDataRange,
} from '@/lib/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { usePool } from '../../usePool'

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
    label: '30 days',
  },
  {
    value: GqlPoolSnapshotDataRange.NinetyDays,
    label: '90 days',
  },
  {
    value: GqlPoolSnapshotDataRange.OneHundredEightyDays,
    label: '180 days',
  },
  {
    value: GqlPoolSnapshotDataRange.AllTime,
    label: 'All time',
  },
]

export interface PoolChartTypeOptions {
  type: 'line' | 'bar'
  color: string
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
    color: theme.colors.green[400],
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

export const defaultPoolChartOptions = {
  grid: {
    left: '2.5%',
    right: 0,
    top: '10%',
    bottom: '5%',
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
    show: true,
    showContent: false,
    trigger: 'axis',
    confine: true,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    axisPointer: {
      animation: false,
      type: 'shadow',
      label: {
        show: false,
      },
    },
  },
}

export function formPoolTabsList({
  variant,
  poolType,
}: {
  variant: string
  poolType: string
}): PoolChartTypeTab[] {
  if (poolType === 'LIQUIDITY_BOOTSTRAPPING' && variant === 'v2') {
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
    },
    notifyOnNetworkStatusChange: true,
  })
}

export function usePoolCharts() {
  const { pool } = usePool()
  const { id: poolId, variant } = useParams()

  const tabsList = useMemo(() => {
    const poolType = pool?.type
    if (!poolType) return []
    if (typeof variant !== 'string') return []
    console.log({ variant, poolType })
    return formPoolTabsList({ variant, poolType })
  }, [pool?.type, variant])

  const [activeTab, setActiveTab] = useState(tabsList[0].value)
  const [chartValue, setChartValue] = useState(0)
  const [chartDate, setChartDate] = useState('')
  const [activePeriod, setActivePeriod] = useState(GqlPoolSnapshotDataRange.ThirtyDays)

  const { data, loading } = usePoolSnapshots(poolId as string, activePeriod)

  const chartData = useMemo(() => {
    const snapshots = data?.snapshots
    if (!snapshots) return []

    if (activeTab === PoolChartTab.TVL) {
      return snapshots.map(snapshot => {
        return [snapshot.timestamp, snapshot.totalLiquidity]
      })
    }

    if (activeTab === PoolChartTab.FEES) {
      return snapshots.map(snapshot => {
        return [snapshot.timestamp, snapshot.fees24h]
      })
    }

    return snapshots.map(snapshot => {
      return [snapshot.timestamp, snapshot.volume24h]
    })
  }, [data?.snapshots, activeTab])

  const options = useMemo(() => {
    const activeTabOptions = poolChartTypeOptions[activeTab]

    return {
      ...defaultPoolChartOptions,
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
  }, [chartData, activeTab])

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
    console.log({ lastChartData })
    if (!lastChartData) return
    setChartValue(Number(lastChartData?.[1]))
    setChartDate(format(new Date(Number(lastChartData?.[0]) * 1000), 'dd MMM yyyy'))
  }, [chartData])

  return {
    loading,
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
  }
}
