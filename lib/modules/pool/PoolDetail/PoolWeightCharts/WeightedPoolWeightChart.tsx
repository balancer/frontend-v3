/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, VStack, Text, useTheme, useColorMode } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { motion } from 'framer-motion'
import { GqlChain, GqlPoolWeighted } from '@/lib/shared/services/api/generated/graphql'
import { ChartSizeValues } from './PoolWeightChart'
import PoolWeightChartChainIcon from './PoolWeightChartChainIcon'

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

interface WeightedPoolWeightChartProps {
  pool: GqlPoolWeighted
  chain: GqlChain
  hasLegend?: boolean
  isSmall?: boolean
}

const smallSize: ChartSizeValues = {
  chartHeight: '150px',
  boxWidth: 150,
  boxHeight: 150,
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

export default function WeightedPoolWeightChart({
  pool,
  chain,
  hasLegend,
  isSmall,
}: WeightedPoolWeightChartProps) {
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
          radius: ['55%', '80%'],
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
  }, [pool, colorMode])

  return (
    <VStack>
      <Box
        width={`${chartSizeValues.boxWidth}px`}
        height={`${chartSizeValues.boxHeight}`}
        position="relative"
      >
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          width={chartSizeValues.haloWidth}
          height={chartSizeValues.haloHeigth}
          transform="translateY(-50%)"
          bottom="0"
          top="50%"
          left="0"
          right="0"
          mx="auto"
          zIndex={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChartLoaded ? 1 : 0, transition: { delay: 0.1 } }}
        >
          <PoolWeightChartChainIcon chain={chain} isChartLoaded={isChartLoaded} isSmall={isSmall} />
        </Box>
        <Box width={`${chartSizeValues.boxWidth}`} height={`${chartSizeValues.boxHeight}`}>
          <ReactECharts
            style={{
              width: `${chartSizeValues.boxWidth}ox`,
              height: `${chartSizeValues.boxHeight}px`,
            }}
            option={chartOption}
            onEvents={{}}
            ref={eChartsRef}
          />
        </Box>
      </Box>
      {hasLegend && (
        <HStack mt="-4" spacing="6">
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
      )}
    </VStack>
  )
}
