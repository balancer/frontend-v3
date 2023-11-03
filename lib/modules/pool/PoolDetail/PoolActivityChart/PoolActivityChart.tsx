import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Stack } from '@chakra-ui/react'
import { usePoolActivityChart } from './usePoolActivityChart'
import { ActivityChartTypeTabs } from './ActivityChartTypeTabs'

export function PoolActivityChart() {
  const { chartOption, activeTab, setActiveTab, tabsList, eChartsRef } = usePoolActivityChart()

  return (
    <Stack
      px="40px"
      py="20px"
      maxWidth="900px"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="16px"
    >
      {chartOption && (
        <Box>
          <ActivityChartTypeTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabsList={tabsList}
          />
          <ReactECharts option={chartOption} onEvents={{}} ref={eChartsRef} />
        </Box>
      )}
    </Stack>
  )
}
