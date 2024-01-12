import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import Image from 'next/image'
import { usePool } from '../../usePool'
import * as echarts from 'echarts/core'
import { motion } from 'framer-motion'

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

export default function WeightedPoolWeightChart() {
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
        trigger: 'item',
        show: false,
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '80%',
          itemStyle: {
            borderColor: '#4F5764',
            borderWidth: 2.5,
          },
          label: {
            show: false,
            position: 'center',
          },

          labelLine: {
            show: false,
          },
          data: pool.tokens.map((token, i) => ({
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
  }, [pool])

  return (
    <VStack spacing="6">
      <Box width="250px" height="250px" mt="-8" position="relative">
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          top="50%"
          transform="translateY(0)"
          left="95px"
          zIndex={4}
          width="60px"
          height="60px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChartLoaded ? 1 : 0, transition: { delay: 0.1 } }}
        >
          <Image
            src={`/images/chains/${chain}.svg`}
            alt={`Chain icon for ${chain.toLowerCase()}`}
            width={45}
            height={45}
          />
        </Box>
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          top="48%"
          transform="translateY(0)"
          left="90px"
          zIndex={3}
          width="70px"
          height="70px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChartLoaded ? 0.2 : 0, transition: { delay: 0.3 } }}
        />
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          top="46%"
          transform="translateY(0)"
          left="85px"
          zIndex={3}
          width="80px"
          height="80px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChartLoaded ? 0.1 : 0, transition: { delay: 0.5 } }}
        />
        <Box width="full" height="full">
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
    </VStack>
  )
}
