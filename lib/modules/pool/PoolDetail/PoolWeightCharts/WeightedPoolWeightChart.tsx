import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import Image from 'next/image'
import * as echarts from 'echarts/core'
import { motion } from 'framer-motion'
import { GqlPoolWeighted } from '@/lib/shared/services/api/generated/graphql'
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

interface WeightedPoolWeightChartProps {
  pool: GqlPoolWeighted
  chain: string
  chartSizeValues: ChartSizeValues
  hasLegend?: boolean
}

export default function WeightedPoolWeightChart({
  pool,
  chain,
  chartSizeValues,
  hasLegend,
}: WeightedPoolWeightChartProps) {
  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const [isChartLoaded, setIsChartLoaded] = useState(false)

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
      <Box
        width={chartSizeValues.boxWidth}
        height={chartSizeValues.boxHeight}
        mt="-8"
        position="relative"
      >
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          top={chartSizeValues.haloTop.inner}
          left={chartSizeValues.haloLeft.inner}
          width={chartSizeValues.haloWidth.inner}
          height={chartSizeValues.haloHeigth.inner}
          transform="translateY(0)"
          zIndex={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChartLoaded ? 1 : 0, transition: { delay: 0.1 } }}
        >
          <Image
            src={`/images/chains/${chain}.svg`}
            alt={`Chain icon for ${chain.toLowerCase()}`}
            width={chartSizeValues.imageWidth}
            height={chartSizeValues.imageHeight}
          />
        </Box>
        <Box
          as={motion.div}
          rounded="full"
          bg="white"
          position="absolute"
          top={chartSizeValues.haloTop.middle}
          left={chartSizeValues.haloLeft.middle}
          width={chartSizeValues.haloWidth.middle}
          height={chartSizeValues.haloHeigth.middle}
          transform="translateY(0)"
          zIndex={3}
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
          top={chartSizeValues.haloTop.outer}
          left={chartSizeValues.haloLeft.outer}
          width={chartSizeValues.haloWidth.outer}
          height={chartSizeValues.haloHeigth.outer}
          transform="translateY(0)"
          zIndex={3}
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
      {hasLegend && (
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
      )}
    </VStack>
  )
}
