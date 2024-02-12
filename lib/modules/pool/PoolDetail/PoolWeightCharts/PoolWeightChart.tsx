import { Box } from '@chakra-ui/react'
import React from 'react'
import WeightedPoolWeightChart from './WeightedPoolWeightChart'
import { GqlChain, GqlPoolStable, GqlPoolUnion } from '@/lib/shared/services/api/generated/graphql'
import { isBoosted, isStable } from '../../pool.helpers'
import BoostedPoolWeightChart from './BoostedPoolWeightChart'
import StablePoolWeightChart from './StablePoolWeightChart'

interface PoolWeightChartProps {
  pool: GqlPoolUnion
  chain: GqlChain
  hasLegend?: boolean
  isSmall?: boolean
}

export interface ChartSizeValues {
  chartHeight: string
  boxWidth: number
  boxHeight: number
  haloTop: string
  haloLeft: string
  haloWidth: string
  haloHeigth: string
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

export default function PoolWeightChart({
  pool,
  chain,
  hasLegend = true,
  isSmall = false,
}: PoolWeightChartProps) {
  const chartSizeValues = isSmall ? smallSize : normalSize

  if (isBoosted(pool) || (isStable(pool.type) && pool.tokens.length === 3)) {
    return (
      <BoostedPoolWeightChart
        pool={pool as GqlPoolStable}
        chain={chain}
        hasLegend={hasLegend}
        isSmall={isSmall}
      />
    )
  }
  if (isStable(pool.type)) {
    return (
      <StablePoolWeightChart
        pool={pool as GqlPoolStable}
        chain={chain}
        hasLegend={hasLegend}
        isSmall={isSmall}
      />
    )
  }
  if (pool.__typename === 'GqlPoolWeighted') {
    return (
      <WeightedPoolWeightChart pool={pool} chain={chain} hasLegend={hasLegend} isSmall={isSmall} />
    )
  }
  return <Box minH="150px"></Box>
}
