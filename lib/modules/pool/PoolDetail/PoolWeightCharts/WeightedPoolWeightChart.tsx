'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, VStack, useTheme } from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { motion } from 'framer-motion'
import { ChartSizeValues, PoolWeightChartProps } from './PoolWeightChart'
import PoolWeightChartLegend from './PoolWeightChartLegend'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import Image from 'next/image'

const smallSize: ChartSizeValues = {
  chartHeight: '140px',
  boxWidth: 140,
  boxHeight: 140,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '250px',
  boxWidth: 250,
  boxHeight: 250,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

function OuterSymbolCircle({ opacity, isSmall }: { opacity: string; isSmall: boolean }) {
  const colorMode = useThemeColorMode()
  const theme = useTheme()
  const colorModeKey = colorMode === 'light' ? 'default' : '_dark'
  const chartOuter = isSmall ? '' : theme.semanticTokens.shadows.chartIconOuter[colorModeKey]
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      width="55%"
      height="55%"
      overflow="hidden"
      filter={chartOuter}
      opacity={opacity}
      display="flex"
      justifyContent="center"
      alignItems="center"
      rounded="full"
    >
      <Box bg="background.level3" width="full" height="full" filter={chartOuter} shadow="2xl" />
    </Box>
  )
}

function InnerSymbolCircle({ opacity }: { opacity: string; isSmall: boolean }) {
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      width="45%"
      height="45%"
      overflow="hidden"
      rounded="full"
      opacity={opacity}
    >
      <Box
        bg="background.level4"
        width="full"
        height="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
      ></Box>
    </Box>
  )
}

export default function WeightedPoolWeightChart({
  pool,
  chain,
  hasLegend,
  isSmall,
  colors = [],
}: PoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const theme = useTheme()
  const colorMode = useThemeColorMode()

  const chartOption = useMemo(() => {
    return {
      ...(chartSizeValues.chartHeight && { height: chartSizeValues.chartHeight }),
      tooltip: {
        trigger: 'item',
        show: false,
      },
      animation: false,
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
          radius: ['70%', '99%'],
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
          data: pool.displayTokens.map((token, i) => ({
            value: parseFloat(token.weight || '0') * 100,
            name: token.symbol,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: colors[i].from,
                },
                {
                  offset: 0,
                  color: colors[i].to,
                },
              ]),
            },
          })),
        },
      ],
    }
  }, [pool, colorMode])

  return (
    <VStack>
      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxHeight}`}
        position="relative"
        transition="all 0.2s var(--ease-out-cubic)"
        _groupHover={{ transform: 'translateY(0) scale(1.05)' }}
      >
        <Box width="full" height="full" rounded="full" shadow="md" top="0" position="absolute" />
        <Box
          position="absolute"
          as={motion.div}
          bottom="0"
          left="0"
          right="0"
          width={`${chartSizeValues.boxWidth * 0.7}px`}
          height={`${chartSizeValues.boxHeight * 0.7}px`}
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
          >
            <Box position="absolute" top="50%" transformOrigin="center" transform="translateY(-50%)" zIndex={5} transition="all 0.2s ease-out"  _groupHover={{ transform: "scale(1.15) translateY(-50%)" }}>
              <Image
                src={`/images/chains/${chain}.svg`}
                alt={`Chain icon for ${chain.toLowerCase()}`}
                width={isSmall ? 28 : 36}
                height={isSmall ? 28 : 36}
              />
            </Box>

            {/* Since these triangles utilise clip-path, we cannot use box-shadow, we need to utilise css filters */}
            {/* Simply applying an opacity to the background color will achieve weird effects, so to match the designs */}
            {/* We utilise layers of the same component! */}
            <OuterSymbolCircle opacity="10%" isSmall={isSmall || false} />
            <OuterSymbolCircle opacity="20%" isSmall={isSmall || false} />
            <OuterSymbolCircle opacity="20%" isSmall={isSmall || false} />
            <InnerSymbolCircle opacity="30%" isSmall={isSmall || false} />
            <InnerSymbolCircle opacity="30%" isSmall={isSmall || false} />
            <InnerSymbolCircle opacity="30%" isSmall={isSmall || false} />
          </NoisyCard>
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
      {hasLegend && <PoolWeightChartLegend pool={pool} colors={colors} />}
    </VStack>
  )
}
