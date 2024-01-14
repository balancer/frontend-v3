import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { usePool } from '../../usePool'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ChainLogoHalo from './ChainLogoHalo'

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

export default function BoostedPoolWeightChart() {
  const { pool, chain } = usePool()
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
        show: false
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '150%',
          //   radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 2,
            borderColor: '#4F5764',
            borderWidth: 2,
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
    <VStack spacing='4'>
      <svg
        style={{ visibility: 'hidden', position: 'absolute' }}
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="round">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
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
      <Box width="278px" height="230px" filter="url(#round)" overflow="hidden">
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          top="54%"
          transform="translateY(0)"
          left="109px"
          zIndex={4}
          width="60px"
          height="60px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChartLoaded ? 1 : 0, transition: { delay: 0.1 } }}
        >
          <ChainLogoHalo chain={chain} isChartLoaded={isChartLoaded} />
        </Box>
        <Box width="full" height="full" clipPath="polygon(50% 0, 100% 100%, 0 100%)">
          <ReactECharts option={chartOption} onEvents={{}} ref={eChartsRef} />
        </Box>
      </Box>
      <HStack spacing="6">
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
                <Text color="gray.400">{token.symbol}</Text>
              </HStack>
            </Box>
          )
        })}
      </HStack>
    </VStack >
  )
}
