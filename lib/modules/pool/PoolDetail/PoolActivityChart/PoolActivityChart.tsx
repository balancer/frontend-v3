import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Card, HStack, Heading } from '@chakra-ui/react'
import { usePoolActivityChart } from './usePoolActivityChart'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'

export function PoolActivityChart() {
  const { chartOption, activeTab, setActiveTab, tabsList, eChartsRef } = usePoolActivityChart()

  console.log('chart', activeTab, chartOption)
  return (
    <Card variant="elevation2" shadow="2xl" width="full" px="4" py="5">
      <HStack width="full" justifyContent="space-between">
        <Heading fontWeight="bold" size="h5">
          Transactions
        </Heading>
        <ButtonGroup
          currentOption={activeTab}
          options={tabsList}
          onChange={option => {
            setActiveTab(option)
          }}
          size="lg"
        />
      </HStack>
      {chartOption && (
        <Box>
          <ReactECharts option={chartOption} onEvents={{}} ref={eChartsRef} />
        </Box>
      )}
    </Card>
  )
}
