'use client'
import { usePool } from '@/lib/modules/pool/usePool'
import { Box, HStack, Stack, Text } from '@chakra-ui/react'

import ReactECharts from 'echarts-for-react'
import { useCallback, useMemo, useState } from 'react'

import { format } from 'date-fns'
import { PoolChartTypeTabs } from './PoolChartTypeTabs'
import {
  PoolChartTab,
  poolChartTabs,
  poolChartTypeOptions,
  defaultPoolChartOptions,
  usePoolSnapshots,
} from './usePoolCharts'
import { GqlPoolSnapshotDataRange } from '@/lib/services/api/generated/graphql'
import { PoolChartPeriodSelector } from './PoolChartPeriodSelector'
import Loading from '@/app/pools/[chain]/[variant]/[id]/loading'
import numeral from 'numeral'

export function PoolChart() {
  const { pool } = usePool()

  const [activeTab, setActiveTab] = useState(poolChartTabs[0].value)
  const [chartValue, setChatValue] = useState(0)
  const [chartDate, setChartDate] = useState('')
  const [activePeriod, setActivePeriod] = useState(GqlPoolSnapshotDataRange.ThirtyDays)

  const { data, loading } = usePoolSnapshots(pool?.id, activePeriod)

  const chartData = useMemo(() => {
    const snapshots = data?.snapshots
    if (!snapshots) return

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

      setChatValue(Number(chartHoverValue))
      setChartDate(format(new Date(Number(chartHoverDate) * 1000), 'dd MMM yyyy'))
    },
    [chartData]
  )

  const handleMouseLeave = useCallback(() => {
    const lastChartData = chartData?.[chartData.length - 1]
    setChatValue(Number(lastChartData?.[1]))
    setChartDate(format(new Date(Number(lastChartData?.[0]) * 1000), 'dd MMM yyyy'))
  }, [chartData])

  return (
    <Stack
      px="lg"
      py="md"
      maxWidth="900px"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="16px"
    >
      <HStack justifyContent="space-between">
        <HStack gap="16px">
          <PoolChartTypeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <PoolChartPeriodSelector activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        </HStack>
        <Stack gap="0" textAlign="right">
          <Text fontSize="24px">{numeral(chartValue).format('($0,0)')}</Text>
          <Text>{chartDate}</Text>
        </Stack>
      </HStack>
      {loading && <Loading />}
      {chartData && (
        <Box onMouseLeave={handleMouseLeave}>
          <ReactECharts
            option={options}
            onEvents={{
              updateAxisPointer: handleAxisMoved,
            }}
          />
        </Box>
      )}
    </Stack>
  )
}
