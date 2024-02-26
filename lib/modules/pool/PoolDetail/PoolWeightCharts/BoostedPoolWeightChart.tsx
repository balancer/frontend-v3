/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, VStack, useTheme, useColorMode } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { motion } from 'framer-motion'
import PoolWeightChartChainIcon from './PoolWeightChartChainIcon'
import { ChartSizeValues, PoolTokensWeightChartProps } from './PoolWeightChart'
import PoolWeightChartLegend from './PoolWeightChartLegend'

const smallSize: ChartSizeValues = {
  chartHeight: '150px',
  boxWidth: 150,
  boxHeight: 130,
  haloTop: '40%',
  haloLeft: '55px',
  haloWidth: '40px',
  haloHeigth: '40px',
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: 278,
  boxHeight: 230,
  haloTop: '49%',
  haloLeft: '95px',
  haloWidth: '60px',
  haloHeigth: '60px',
}

export default function BoostedPoolWeightChart({
  tokens,
  chain,
  hasLegend,
  isSmall,
  colors = [],
}: PoolTokensWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const [isChartLoaded, setIsChartLoaded] = useState(false)
  const theme = useTheme()
  const { colorMode } = useColorMode()

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
          data: tokens.map((token, i) => ({
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
  }, [colorMode])

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
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
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
        filter="url(#round)"
        overflow="hidden"
        mt={hasLegend ? '-8' : '0'}
        position="relative"
      >
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          transform="translateY(-50%)"
          bottom="0"
          left="0"
          right="0"
          top="65%"
          mx="auto"
          zIndex={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          width={chartSizeValues.haloWidth}
          height={chartSizeValues.haloHeigth}
        >
          <PoolWeightChartChainIcon chain={chain} isChartLoaded={isChartLoaded} isSmall={isSmall} />
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
          <PoolWeightChartLegend tokens={tokens} colors={colors} />
        </HStack>
      )}
    </VStack>
  )
}
