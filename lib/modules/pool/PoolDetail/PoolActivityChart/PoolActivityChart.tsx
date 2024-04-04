'use client'

import React from 'react'
import ReactECharts from 'echarts-for-react'
import { Box, Card, HStack, Heading } from '@chakra-ui/react'
import { usePoolActivityChart } from './usePoolActivityChart'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'

export function PoolActivityChart() {
  const { chartOption, activeTab, setActiveTab, tabsList, eChartsRef } = usePoolActivityChart()

  return (
    <Card>
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
          size="xxs"
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
