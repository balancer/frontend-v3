'use client'
import { Box, Card, Flex, HStack, Heading, Skeleton, Stack, Text, VStack } from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'

import { PoolChartTab, PoolChartTypeTab, poolChartPeriods, usePoolCharts } from './usePoolCharts'

import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { GroupBase, OptionBase, Select, SingleValue } from 'chakra-react-select'
import { GqlPoolSnapshotDataRange } from '@/lib/shared/services/api/generated/graphql'
import { getSelectStyles } from '@/lib/shared/services/chakra/theme/chakra-react-select'

interface PeriodOption extends OptionBase {
  label: string
  value: GqlPoolSnapshotDataRange
}

type Props = {
  value: PeriodOption
  onChange(value: PeriodOption): void
}

export function PeriodSelect({ value, onChange }: Props) {
  const chakraStyles = getSelectStyles<PeriodOption>('gradient')

  function handleChange(newOption: SingleValue<PeriodOption>) {
    if (newOption) onChange(newOption)
  }

  return (
    <Select<PeriodOption, false, GroupBase<PeriodOption>>
      name="Chain"
      value={value}
      options={poolChartPeriods}
      chakraStyles={chakraStyles}
      onChange={handleChange}
      size="sm"
    />
  )
}

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
    <Card minHeight="320px">
      <Stack>
        {isLoading && <Skeleton w="100%" h="300" />}
        {!isLoading && chartData.length > 0 && (
          <VStack width="full" height="full">
            <HStack width="full" justifyContent="space-between">
              <HStack spacing="2" textAlign="right">
                <ButtonGroup
                  size="xxs"
                  currentOption={activeTab}
                  options={tabsList}
                  onChange={tab => setActiveTab(tab as PoolChartTypeTab)}
                />

                <PeriodSelect value={activePeriod} onChange={setActivePeriod} />
              </HStack>
              <VStack spacing="0" alignItems="flex-end">
                <Heading fontWeight="bold" size="h5">
                  {chartValueSum}
                </Heading>
                <Text fontSize="0.9rem">{getActiveTabLabel()}</Text>
              </VStack>
            </HStack>
            <Box width="full" height="full" onMouseLeave={handleMouseLeave}>
              <ReactECharts
                option={options}
                onEvents={{
                  updateAxisPointer: handleAxisMoved,
                }}
              />
            </Box>
          </VStack>
        )}
        {!isLoading && chartData.length <= 0 && (
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
