/* eslint-disable max-len */
'use client'
import ReactECharts from 'echarts-for-react'
import { Box, Card, Divider, HStack, Heading, Text } from '@chakra-ui/react'
import { usePoolActivityChart } from './usePoolActivityChart'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { balTheme } from '@/lib/shared/services/chakra/theme'

const legendTabs = [
  {
    label: 'Adds',
    color: `linear-gradient(to bottom, ${balTheme.semanticTokens.colors.chart.pool.scatter.add.from}, ${balTheme.semanticTokens.colors.chart.pool.scatter.add.to})`,
  },
  {
    label: 'Removes',
    color: `linear-gradient(to bottom, ${balTheme.semanticTokens.colors.chart.pool.scatter.remove.from}, ${balTheme.semanticTokens.colors.chart.pool.scatter.remove.to})`,
  },
  {
    label: 'Swaps',
    color: `linear-gradient(to bottom, ${balTheme.semanticTokens.colors.chart.pool.scatter.swap.from}, ${balTheme.semanticTokens.colors.chart.pool.scatter.swap.to})`,
  },
]
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

      <Divider pt="2" mb="4" />

      <HStack spacing="4" px={['1', '2']}>
        {legendTabs.map((tab, index) => (
          <HStack alignItems="center" key={index} gap="2">
            <Box
              key={index}
              height="2"
              width="2"
              backgroundImage={tab.color}
              borderRadius="50%"
              display="inline-block"
            />
            <Text color="font.secondary" fontSize="sm">
              {tab.label}
            </Text>
          </HStack>
        ))}
      </HStack>
    </Card>
  )
}
