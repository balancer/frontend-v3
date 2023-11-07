'use client'
import { Box, Card, HStack, Stack, Text } from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'
import { PoolChartTypeTabs } from './PoolChartTypeTabs'
import { usePoolCharts } from './usePoolCharts'
import { PoolChartPeriodSelector } from './PoolChartPeriodSelector'
import numeral from 'numeral'
import GradientText from '@/lib/shared/components/text/GradientText'

export function PoolChart() {
  const {
    activeTab,
    setActiveTab,
    activePeriod,
    setActivePeriod,
    chartValue,
    chartDate,
    isLoading,
    chartData,
    options,
    handleAxisMoved,
    handleMouseLeave,
    tabsList,
  } = usePoolCharts()

  return (
    <Card variant="gradient">
      <HStack p="5">
        <Text variant='heading' fontWeight="bold" as="h2" fontSize="xl">
          My liquidity
        </Text>
      </HStack>
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
            <PoolChartTypeTabs
              tabsList={tabsList}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <PoolChartPeriodSelector
              activePeriod={activePeriod}
              setActivePeriod={setActivePeriod}
            />
          </HStack>
          <Stack gap="0" textAlign="right">
            <Text fontSize="24px">{numeral(chartValue).format('($0,0)')}</Text>
            <Text>{chartDate}</Text>
          </Stack>
        </HStack>
        {isLoading && <div>Loading...</div>}
        {chartData.length > 0 ? (
          <Box onMouseLeave={handleMouseLeave}>
            <ReactECharts
              option={options}
              onEvents={{
                updateAxisPointer: handleAxisMoved,
              }}
            />
          </Box>
        ) : (
          <Text p="lg">Empty pool snapshots list</Text>
        )}
      </Stack>
    </Card>
  )
}
