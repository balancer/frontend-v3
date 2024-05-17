'use client'
import {
  Box,
  BoxProps,
  Card,
  Flex,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import ReactECharts from 'echarts-for-react'
import { PoolChartTab, PoolChartTypeTab, poolChartPeriods, usePoolCharts } from './usePoolCharts'
import ButtonGroup from '@/lib/shared/components/btns/button-group/ButtonGroup'
import { GroupBase, OptionBase, Select, SingleValue } from 'chakra-react-select'
import { GqlPoolSnapshotDataRange } from '@/lib/shared/services/api/generated/graphql'
import { getSelectStyles } from '@/lib/shared/services/chakra/theme/chakra-react-select'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'

interface PeriodOption extends OptionBase {
  label: string
  value: GqlPoolSnapshotDataRange
}

type Props = {
  value: PeriodOption
  onChange(value: PeriodOption): void
}

const COMMON_NOISY_CARD_PROPS: { contentProps: BoxProps; cardProps: BoxProps } = {
  contentProps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 'none',
    borderTopLeftRadius: 'none',
    borderBottomRightRadius: 'none',
  },
  cardProps: {
    position: 'relative',
    overflow: 'hidden',
  },
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
    <Card minHeight="320px" h="full">
      <Stack h="full">
        {isLoading && <Skeleton w="full" h="full" />}
        {!isLoading && chartData.length > 0 && (
          <NoisyCard
            cardProps={COMMON_NOISY_CARD_PROPS.cardProps}
            contentProps={COMMON_NOISY_CARD_PROPS.contentProps}
          >
            <VStack w="full" h="full" p="md">
              <Stack w="full" direction={{ base: 'column', md: 'row' }}>
                <HStack alignSelf="flex-start">
                  <ButtonGroup
                    size="xxs"
                    currentOption={activeTab}
                    options={tabsList}
                    onChange={tab => setActiveTab(tab as PoolChartTypeTab)}
                    width="70px"
                  />
                  <PeriodSelect value={activePeriod} onChange={setActivePeriod} />
                </HStack>
                <VStack
                  spacing="0"
                  alignItems={{ base: undefined, md: 'flex-end' }}
                  ml={{ base: undefined, md: 'auto' }}
                >
                  <Heading fontWeight="bold" size="h5">
                    {chartValueSum}
                  </Heading>
                  <Text fontSize="sm" color="grayText">
                    {getActiveTabLabel()}
                  </Text>
                </VStack>
              </Stack>
              <Box w="full" h="full" onMouseLeave={handleMouseLeave}>
                <ReactECharts
                  style={{ height: '100%' }}
                  option={options}
                  onEvents={{
                    updateAxisPointer: handleAxisMoved,
                  }}
                />
              </Box>
            </VStack>
          </NoisyCard>
        )}
        {!isLoading && chartData.length <= 0 && (
          <Flex h="full" alignItems="center">
            <Text fontSize="2xl" variant="secondary" p="lg">
              Not enough data
            </Text>
          </Flex>
        )}
      </Stack>
    </Card>
  )
}
