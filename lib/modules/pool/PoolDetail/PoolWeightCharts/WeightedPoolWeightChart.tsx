import { Box, HStack, VStack, Text, Button } from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import { usePool } from '../../usePool'
import * as echarts from 'echarts/core'

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
  const { pool } = usePool()

  const eChartsRef = useRef<EChartsReactCore | null>(null)
  const chartOption = useMemo(() => {
    console.log('pool', pool.tokens)
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
      <Box width="250px" height="250px" mt="-8">
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
