/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { usePool } from '../../usePool'
import { motion } from 'framer-motion'
import PoolWeightChartChainIcon from './PoolWeightChartChainIcon'
import { WeightedPoolWeightChartProps } from './StablePoolWeightChart'
import { ChartSizeValues } from './PoolWeightChart'

const colors = [
  {
    from: '#1E4CF1',
    to: '#00FFAA',
  },
  {
    from: '#B2C4DB',
    to: '#FDFDFD',
  },
  {
    from: '#EF4A2B',
    to: '#F48975',
  },
  {
    from: '#FFD600',
    to: '#F48975',
  },
  {
    from: '#9C68AA',
    to: '#C03BE4',
  },
  {
    from: '#FFBD91',
    to: '#FF957B',
  },
  {
    from: '#30CEF0',
    to: '#02A2FE',
  },
]

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
  pool,
  chain,
  hasLegend,
  isSmall,
}: WeightedPoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const [isChartLoaded, setIsChartLoaded] = useState(false)

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
          name: 'Access From',
          type: 'pie',
          radius: '250%',
          //   radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 2,
            borderColor: '#2D3748',
            borderWidth: 3.5,
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: pool.tokens.map((token, i) => ({
            value: 33,
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
  }, [])

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
          <PoolWeightChartChainIcon chain={chain} isChartLoaded={true} isSmall={isSmall} />
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
          spacing="6"
          justifyContent="center"
        >
          {pool.tokens.map((token, i) => {
            return (
              <Box
                fontWeight="normal"
                fontSize="1rem"
                background="none"
                key={`token-weight-chart-legend-${token.symbol}`}
              >
                <HStack>
                  <Box width="8px" height="8px" bg={colors[i].from} rounded="full" />
                  <Text whiteSpace="nowrap" color="gray.400">
                    {token.symbol}
                  </Text>
                </HStack>
              </Box>
            )
          })}
        </HStack>
      )}
    </VStack>
  )
}
