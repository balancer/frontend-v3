'use client'
import { Box, Card, Flex, HStack, Heading, Skeleton, Stack, Text } from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'

import { PoolChartTypeTab, poolChartPeriods, usePoolCharts } from './usePoolCharts'

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

  return (
    <Card variant="gradient">
      <Stack px="lg" py="md">
        {isLoading ? (
          <Skeleton w="100%" h="300" />
        ) : chartData.length > 0 ? (
          <Stack>
            <HStack justifyContent="space-between">
              <HStack gap="16px">
                <Heading fontWeight="bold" size="h5">
                  {chartValueSum}
                </Heading>

                <PeriodSelect value={activePeriod} onChange={setActivePeriod} />
              </HStack>
              <Stack gap="0" textAlign="right">
                <ButtonGroup
                  currentOption={activeTab}
                  options={tabsList}
                  onChange={tab => setActiveTab(tab as PoolChartTypeTab)}
                />
              </Stack>
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
