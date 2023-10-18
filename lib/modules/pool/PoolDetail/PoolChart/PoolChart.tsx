'use client'

import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'
import { PoolChartTypeTabs } from './PoolChartTypeTabs'
import { usePoolCharts } from './usePoolCharts'
import { PoolChartPeriodSelector } from './PoolChartPeriodSelector'
import Loading from '@/app/pools/[chain]/[variant]/[id]/loading'
import numeral from 'numeral'

export function PoolChart() {
  const {
    activeTab,
    setActiveTab,
    activePeriod,
    setActivePeriod,
    chartValue,
    chartDate,
    loading,
    chartData,
    options,
    handleAxisMoved,
    handleMouseLeave,
  } = usePoolCharts()

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
