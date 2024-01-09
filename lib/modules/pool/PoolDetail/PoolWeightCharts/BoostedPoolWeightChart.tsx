import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { useMemo, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import EChartsReactCore from 'echarts-for-react/lib/core'

export default function BoostedPoolWeightChart() {
  const eChartsRef = useRef<EChartsReactCore | null>(null)

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
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
          data: [
            { value: 50, name: 'ETH' },
            { value: 50, name: 'BTC' },
            { value: 50, name: 'OP' },
            { value: 50, name: 'ARB' },
          ],
        },
      ],
    }
  }, [])

  return (
    <VStack>
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
        <Box width="full" height="full" clipPath="polygon(50% 0, 100% 100%, 0 100%)">
          <ReactECharts option={chartOption} onEvents={{}} ref={eChartsRef} />
        </Box>
      </Box>
      <HStack>
        <Text>ETH</Text>
        <Text>BTC</Text>
        <Text>OP</Text>
        <Text>ARB</Text>
      </HStack>
    </VStack>
  )
}
