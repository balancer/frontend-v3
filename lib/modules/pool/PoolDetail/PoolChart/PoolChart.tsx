'use client'
import { Box, Card, Flex, HStack, Heading, Skeleton, Stack, Text, VStack } from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'

import { PoolChartTab, PoolChartTypeTab, poolChartPeriods, usePoolCharts } from './usePoolCharts'

import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { Selector } from '@/lib/shared/components/selector/Selector'

export function PoolChart() {
  const {
    activeTab,
    setActiveTab,
    activePeriod,
    setActivePeriod,
    isLoading,
    chartData,
    options,
    handleAxisMoved,
    handleMouseLeave,
    tabsList,
    chartValueSum,
  } = usePoolCharts()

  function getActiveTabLabel() {
    switch (activeTab.value) {
      case PoolChartTab.TVL:
        return 'Total value locked'
      case PoolChartTab.FEES:
        return `${activePeriod.label} fees`
      case PoolChartTab.VOLUME:
        return `${activePeriod.label} volume`
    }
  }

  return (
    <Card variant="level2" shadow="2xl" width="full" minHeight="320px">
      <VStack width="full">
        {isLoading && <Skeleton w="100%" h="300" />}
        {chartData.length > 0 && (
          <VStack width="full" alignItems="flex-start">
            <HStack width="full" justifyContent="space-between" p="4">
              <HStack gap="16px">
                <Stack gap="0" textAlign="right">
                  <ButtonGroup
                    currentOption={activeTab}
                    options={tabsList}
                    onChange={tab => setActiveTab(tab as PoolChartTypeTab)}
                  />
                </Stack>
                <Selector
                  activeOption={activePeriod}
                  onChange={option => {
                    const period =
                      poolChartPeriods.find(period => period.value === option) ||
                      poolChartPeriods[0]
                    setActivePeriod(period)
                  }}
                  options={poolChartPeriods}
                  variant="primary"
                />
              </HStack>

              <VStack spacing="0" alignItems="flex-end">
                <Heading fontWeight="bold" size="h5">
                  {chartValueSum}
                </Heading>
                <Text fontSize="0.85rem">{getActiveTabLabel()}</Text>
              </VStack>
            </HStack>
            <Box px="0" width="full" height="full" onMouseLeave={handleMouseLeave}>
              <ReactECharts
                option={options}
                onEvents={{
                  updateAxisPointer: handleAxisMoved,
                }}
              />
            </Box>
          </VStack>
        )}
        {chartData.length <= 0 && (
          <Flex h="100" alignItems="center">
            <Text fontSize="2xl" variant="secondary" p="lg">
              Not enough data
            </Text>
          </Flex>
        )}
      </VStack>
    </Card>
  )
}
