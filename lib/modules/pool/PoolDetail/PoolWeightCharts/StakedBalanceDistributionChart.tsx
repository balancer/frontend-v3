'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, Text, VStack, useTheme } from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'

const smallSize: ChartSizeValues = {
  chartHeight: '250px',
  boxWidth: 250,
  boxHeight: 250,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: 275,
  boxHeight: 275,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

export default function StakedBalanceDistributionChart({
  pool,
  isSmall = true,
}: PoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const theme = useTheme()
  const colorMode = useThemeColorMode()

  const unstakedBalance =
    (pool.userBalance?.totalBalanceUsd || 0) - (pool.userBalance?.stakedBalanceUsd || 0)
  const userHasLiquidity = (pool.userBalance?.totalBalanceUsd || 0) > 0

  function getData() {
    const data = []
    if (unstakedBalance > 0) {
      data.push({
        value: unstakedBalance,
        name: 'Unstaked balance',
        itemStyle: {
          color: theme.semanticTokens.colors.font.light,
        },
      })
    }
    if ((pool.userBalance?.stakedBalanceUsd || 0) > 0) {
      data.push({
        value: pool.userBalance?.stakedBalanceUsd || 0,
        name: 'Staked balance',
        itemStyle: { color: theme.semanticTokens.colors.chart.stakedBalance },
      })
    }

    if (!userHasLiquidity) {
      data.push({
        value: 0,
        name: 'No current balance',
        itemStyle: {
          color: theme.semanticTokens.colors.font.light,
        },
      })
    }
    return data
  }

  const chartOption = useMemo(() => {
    return {
      ...(chartSizeValues.chartHeight && { height: chartSizeValues.chartHeight }),
      tooltip: {
        trigger: 'item',
        show: false,
      },
      legend: {
        show: false,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['57%', '80%'],
          itemStyle: {
            borderColor: theme.colors['chartBorder'][colorMode],
            borderWidth: 1.5,
          },
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            scale: false,
          },
          data: getData(),
        },
      ],
    }
  }, [pool, colorMode])

  return (
    <HStack>
      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxHeight}`}
        position="relative"
      >
        <Box
          position="absolute"
          as={motion.div}
          bottom="0"
          left="0"
          right="0"
          width={`${chartSizeValues.boxWidth * 0.58}px`}
          height={`${chartSizeValues.boxHeight * 0.58}px`}
          zIndex={4}
          mx="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
          top="50%"
          transform="translateY(-50%)"
          rounded="full"
        >
          <NoisyCard
            cardProps={{
              rounded: 'full',
            }}
            contentProps={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              shadow: 'innerXl',
              rounded: 'full',
            }}
            shadowContainerProps={{ shadow: 'none' }}
          ></NoisyCard>
        </Box>
        <Box
          position="relative"
          width={`${chartSizeValues.boxWidth}`}
          height={`${chartSizeValues.boxHeight}`}
        >
          <ReactECharts
            style={{
              width: `${chartSizeValues.boxWidth}px`,
              height: `${chartSizeValues.boxHeight}px`,
            }}
            option={chartOption}
            onEvents={{}}
            ref={eChartsRef}
          />
        </Box>
      </Box>
      <VStack alignItems="flex-start">
        {unstakedBalance > 0 && (
          <HStack>
            <Box width="12px" height="12px" bg="font.light" rounded="full" />
            <Text whiteSpace="nowrap" color="font.secondary">
              Unstaked
            </Text>
          </HStack>
        )}

        {(pool.userBalance?.stakedBalanceUsd || 0) > 0 && (
          <HStack>
            <Box width="12px" height="12px" bg="chart.stakedBalance" rounded="full" />
            <Text whiteSpace="nowrap" color="font.secondary">
              Staked on Balancer
            </Text>
          </HStack>
        )}

        {!userHasLiquidity && (
          <HStack>
            <Box width="12px" height="12px" bg="font.light" rounded="full" />
            <Text whiteSpace="nowrap" color="font.secondary">
              No liquidity
            </Text>
          </HStack>
        )}
      </VStack>
    </HStack>
  )
}
