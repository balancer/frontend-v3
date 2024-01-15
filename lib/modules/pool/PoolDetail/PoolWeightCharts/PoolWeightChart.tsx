import { Box } from '@chakra-ui/react'
import React from 'react'
import WeightedPoolWeightChart from './WeightedPoolWeightChart'
import { GqlPoolUnion } from '@/lib/shared/services/api/generated/graphql'

interface PoolWeightChartProps {
  pool: GqlPoolUnion
  chain: string
  hasLegend?: boolean
  isSmall?: boolean
}

export interface ChartSizeValues {
  chartHeight: string
  boxWidth: string
  boxHeight: string
  haloTop: {
    inner: string
    middle: string
    outer: string
  }
  haloLeft: {
    inner: string
    middle: string
    outer: string
  }
  haloWidth: {
    inner: string
    middle: string
    outer: string
  }
  haloHeigth: {
    inner: string
    middle: string
    outer: string
  }
  imageWidth: number
  imageHeight: number
}

const smallSize: ChartSizeValues = {
  chartHeight: '150px',
  boxWidth: '150px',
  boxHeight: '150px',
  haloTop: {
    inner: '40%',
    middle: '36.5%',
    outer: '33%',
  },
  haloLeft: {
    inner: '55px',
    middle: '50px',
    outer: '45px',
  },
  haloWidth: {
    inner: '40px',
    middle: '50px',
    outer: '60px',
  },
  haloHeigth: {
    inner: '40px',
    middle: '50px',
    outer: '60px',
  },
  imageWidth: 25,
  imageHeight: 25,
}

const normalSize: ChartSizeValues = {
  chartHeight: '',
  boxWidth: '250px',
  boxHeight: '250px',
  haloTop: {
    inner: '50%',
    middle: '48%',
    outer: '46%',
  },
  haloLeft: {
    inner: '95px',
    middle: '90px',
    outer: '85px',
  },
  haloWidth: {
    inner: '60px',
    middle: '70px',
    outer: '80px',
  },
  haloHeigth: {
    inner: '60px',
    middle: '70px',
    outer: '80px',
  },
  imageWidth: 45,
  imageHeight: 45,
}

export default function PoolWeightChart({
  pool,
  chain,
  hasLegend = true,
  isSmall = false,
}: PoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize

  if (pool.__typename === 'GqlPoolWeighted') {
    return (
      <WeightedPoolWeightChart
        pool={pool}
        chain={chain}
        hasLegend={hasLegend}
        chartSizeValues={chartSizeValues}
      />
    )
  }
  return <Box></Box>
}
