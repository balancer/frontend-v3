'use client'
import { Box, Card, Flex, HStack, Heading, Skeleton, Stack, Text } from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'

import { PoolChartTypeTab, poolChartPeriods, usePoolCharts } from './usePoolCharts'

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

  return (
    <Card variant="elevation2" shadow="2xl" width="full" minHeight="320px">
      <Stack px="lg" py="md">
        {isLoading ? (
          <Skeleton w="100%" h="300" />
        ) : chartData.length > 0 ? (
          <Stack>
            <HStack justifyContent="space-between">
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
                  variant="special"
                />
              </HStack>

              <Heading fontWeight="bold" size="h5">
                {chartValueSum}
              </Heading>
            </HStack>
            <Box onMouseLeave={handleMouseLeave}>
              <ReactECharts
                option={options}
                onEvents={{
                  updateAxisPointer: handleAxisMoved,
                }}
              />
            </Box>
          </Stack>
        ) : (
          <Flex h="100" alignItems="center">
            <Text fontSize="2xl" variant="secondary" p="lg">
              Not enough data
            </Text>
          </Flex>
        )}
      </Stack>
    </Card>
  )
}
