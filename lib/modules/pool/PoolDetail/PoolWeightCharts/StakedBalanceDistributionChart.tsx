'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, Text, VStack, useTheme } from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { motion } from 'framer-motion'
import { ChartSizeValues } from './PoolWeightChart'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { Pool } from '../../PoolProvider'
import { useSemanticTokenColorMode } from '@/lib/shared/utils/theme'

const smallSize: ChartSizeValues = {
  chartHeight: '225px',
  boxWidth: 225,
  boxHeight: 225,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: 225,
  boxHeight: 225,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

export default function StakedBalanceDistributionChart({
  pool,
  isSmall = true,
}: {
  pool: Pool
  isSmall?: boolean
}) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const theme = useTheme()
  const colorMode = useThemeColorMode()
  const semColorMode = useSemanticTokenColorMode()

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
        value: 100,
        name: 'No current balance',
        itemStyle: {
          color: theme.semanticTokens.colors.background.level2[semColorMode],
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
          radius: ['49%', '80%'],
          itemStyle: {
            borderColor: theme.colors['chartBorder'][colorMode],
            borderWidth: 0,
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
    <HStack spacing="12">
      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxHeight}px`}
        position="relative"
      >
        <Box
          position="absolute"
          as={motion.div}
          bottom="0"
          left="0"
          right="0"
          width={`${chartSizeValues.boxWidth * 0.5}px`}
          height={`${chartSizeValues.boxHeight * 0.5}px`}
          shadow="lg"
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
              rounded: 'full',
              bg: 'background.level3',
            }}
            shadowContainerProps={{ shadow: 'none' }}
          ></NoisyCard>
        </Box>
        <Box
          position="relative"
          width={`${chartSizeValues.boxWidth}px`}
          height={`${chartSizeValues.boxHeight}px`}
          background="background.level3"
          shadow="lg"
          rounded="full"
        >
          <Box
            position="absolute"
            top="50%"
            right="0"
            left="0"
            marginX="auto"
            bg="transparent"
            zIndex={2}
            shadow={userHasLiquidity ? 'lg' : 'innerLg'}
            transform="translateY(-50%)"
            width={`${chartSizeValues.boxWidth * 0.8}px`}
            height={`${chartSizeValues.boxHeight * 0.8}px`}
            rounded="full"
          />
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
      {userHasLiquidity && (
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
        </VStack>
      )}
    </HStack>
  )
}
