'use client'

import { Box } from '@chakra-ui/react'
import React from 'react'
import WeightedPoolWeightChart from './WeightedPoolWeightChart'
import { GqlChain, GqlPoolStable } from '@/lib/shared/services/api/generated/graphql'
import { isBoosted, isClp, isStable } from '../../pool.helpers'
import BoostedPoolWeightChart from './BoostedPoolWeightChart'
import StablePoolWeightChart from './StablePoolWeightChart'
import CLPPoolWeightChart from './CLPPoolWeightChart'
import { Pool } from '../../usePool'

export interface PoolWeightChartProps {
  pool: Pool
  chain: GqlChain
  hasLegend?: boolean
  isSmall?: boolean
  colors?: PoolWeightChartColorDef[]
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

export interface PoolWeightChartColorDef {
  from: string
  to: string
}

export const DEFAULT_POOL_WEIGHT_CHART_COLORS: PoolWeightChartColorDef[] = [
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

export default function PoolWeightChart({
  pool,
  chain,
  hasLegend = true,
  isSmall = false,
}: PoolWeightChartProps) {
  const commonProps = {
    chain,
    hasLegend,
    isSmall,
    colors: DEFAULT_POOL_WEIGHT_CHART_COLORS,
  }
  // if (isBoosted(pool.type)) {
  if (isStable(pool.type) && pool.displayTokens.length === 3) {
    return <BoostedPoolWeightChart pool={pool as GqlPoolStable} {...commonProps} />
  }
  if (isStable(pool.type)) {
    return <StablePoolWeightChart pool={pool as GqlPoolStable} {...commonProps} />
  }
  if (isClp(pool.type)) {
    return <CLPPoolWeightChart pool={pool as GqlPoolStable} {...commonProps} />
  }
  if (pool.__typename === 'GqlPoolWeighted') {
    return <WeightedPoolWeightChart pool={pool} {...commonProps} />
  }
  return <Box minH="150px"></Box>
}
