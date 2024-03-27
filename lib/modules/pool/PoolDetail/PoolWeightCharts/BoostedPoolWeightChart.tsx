'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, VStack, useTheme } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  chartHeight: '150px',
  boxWidth: 160,
  boxHeight: 130,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: 260,
  boxHeight: 200,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

const chartFilters = {
  light: {
    inner:
      'drop-shadow(0px 0px 0px rgba(73, 53, 29, 0.02)) drop-shadow(1px 1px 1px rgba(73, 53, 29, 0.06)) drop-shadow(3px 3px 3px rgba(73, 53, 29, 0.06)) drop-shadow(-0.5px -1px 0px #FFF)',
    outer:
      'drop-shadow(0px 0px 0px rgba(73, 53, 29, 0.02)) drop-shadow(1px 1px 1px rgba(73, 53, 29, 0.06)) drop-shadow(3px 3px 3px rgba(73, 53, 29, 0.06)) drop-shadow(-0.5px -1px 0px #FFF) ',
    chart:
      'drop-shadow(0px 0px 0px rgba(73, 53, 29, 0.4)) drop-shadow(1px 1px 1px rgba(73, 53, 29, 0.09)) drop-shadow(5px 3px 15px rgba(73, 53, 29, 0.3)) drop-shadow(4px -2px 4px rgba(73, 53, 29, 0.2)) drop-shadow(-0.5px -1px 0px #FFF)',
  },
  dark: {
    inner:
      'url(#round) drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.3)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.6)) drop-shadow(3px 5px 5px rgba(0, 0, 0, 0.8))',
    outer:
      'url(#round) drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.2)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(3px 5px 5px rgba(0, 0, 0, 0.2))',
    chart:
      'drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.02)) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.1)) drop-shadow(6px 6px 6px rgba(0, 0, 0, 0.1)) drop-shadow(12px 12px 12px rgba(0, 0, 0, 0.06)) drop-shadow(42px 42px 42px rgba(0, 0, 0, 0.06))',
  },
}

function OuterSymbolTriangle({ opacity }: { opacity: string }) {
  const colorMode = useThemeColorMode()
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      mt="4px"
      width="65%"
      height="65%"
      overflow="hidden"
      filter={`url(#round) ${chartFilters[colorMode].outer}`}
      opacity={opacity}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="background.level3"
        width="full"
        height="full"
        clipPath="polygon(50% 0, 100% 100%, 0 100%)"
        filter={`${chartFilters[colorMode].outer}`}
        shadow="2xl"
      />
    </Box>
  )
}

function InnerSymbolTriangle({ opacity, isSmall }: { opacity: string; isSmall: boolean }) {
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      mt={isSmall ? '10px' : '7px'}
      width="45%"
      height="45%"
      filter="url(#round)"
      overflow="hidden"
      opacity={opacity}
    >
      <Box
        bg="background.level4"
        width="full"
        height="full"
        clipPath="polygon(50% 0, 100% 100%, 0 100%)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
      ></Box>
    </Box>
  )
}

export default function BoostedPoolWeightChart({
  pool,
  chain,
  hasLegend,
  isSmall,
  colors = [],
}: PoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const [isChartLoaded, setIsChartLoaded] = useState(false)
  const theme = useTheme()
  const colorMode = useThemeColorMode()

  useEffect(() => {
    eChartsRef.current?.getEchartsInstance().on('finished', () => {
      setIsChartLoaded(true)
    })
  }, [])

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        show: false,
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: 'pie',
          radius: '250%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 2,
            borderColor: theme.colors['chartBorder'][colorMode],
            borderWidth: 1.5,
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          top: isSmall ? -130 : -48,
          data: pool.displayTokens.map((token, i) => ({
            value: 33,
            name: token.symbol,
            emphasis: {},
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
  }, [colorMode, isSmall])

  return (
    <VStack position="relative" spacing="4">
      <svg
        style={{ visibility: 'hidden', position: 'absolute' }}
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="round">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxHeight}px`}
        filter={`url(#round) ${chartFilters[colorMode].chart}`}
        overflow="hidden"
        mt={hasLegend ? '-8' : '0'}
        position="relative"
      >
        <Box
          position="absolute"
          filter="url(#round)"
          mt={isSmall ? '2px' : '0'}
          as={motion.div}
          bottom="0"
          left="0"
          right="0"
          width={`${chartSizeValues.boxWidth * 0.64}px`}
          height={`${chartSizeValues.boxHeight * 0.63}px`}
          zIndex={4}
          mx="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
          top="56.5%"
          transform="translateY(-50%)"
        >
          <NoisyCard
            cardProps={{
              mt: '-4px',
              clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            }}
            contentProps={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              shadow: 'innerXl',
            }}
          >
            <Box position="absolute" top={isSmall ? '55%' : '50%'} zIndex={5}>
              <Image
                src={`/images/chains/${chain}.svg`}
                alt={`Chain icon for ${chain.toLowerCase()}`}
                width={isSmall ? 15 : 25}
                height={isSmall ? 15 : 25}
              />
            </Box>

            {/* Since these triangles utilise clip-path, we cannot use box-shadow, we need to utilise css filters */}
            {/* Simply applying an opacity to the background color will achieve weird effects, so to match the designs */}
            {/* We utilise layers of the same component! */}
            <OuterSymbolTriangle opacity="10%" />
            <OuterSymbolTriangle opacity="20%" />
            <OuterSymbolTriangle opacity="20%" />
            <InnerSymbolTriangle opacity="30%" isSmall={isSmall || false} />
            <InnerSymbolTriangle opacity="30%" isSmall={isSmall || false} />
            <InnerSymbolTriangle opacity="30%" isSmall={isSmall || false} />
          </NoisyCard>
        </Box>
        <Box width="full" height="full" clipPath="polygon(50% 0, 100% 100%, 0 100%)">
          <ReactECharts option={chartOption} onEvents={{}} ref={eChartsRef} />
        </Box>
      </Box>
      {hasLegend && (
        <HStack
          width="full"
          bottom="-2.5rem"
          position="absolute"
          left="0"
          right="0"
          mx="auto"
          justifyContent="center"
        >
          <PoolWeightChartLegend pool={pool} colors={colors} />
        </HStack>
      )}
    </VStack>
  )
}
