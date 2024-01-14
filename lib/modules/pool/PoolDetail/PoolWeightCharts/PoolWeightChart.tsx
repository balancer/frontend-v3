import { Box } from '@chakra-ui/react'
import React from 'react'
import { usePool } from '../../usePool'
import WeightedPoolWeightChart from './WeightedPoolWeightChart'
import { isBoosted, isStable } from '../../pool.helpers'
import BoostedPoolWeightChart from './BoostedPoolWeightChart'

export default function PoolWeightChart() {
  const { pool } = usePool()

  if (isBoosted(pool) || isStable(pool.type) && pool.tokens.length === 3) {
    return <BoostedPoolWeightChart />
  }
  if (pool.type === 'WEIGHTED') {
    return <WeightedPoolWeightChart />
  }
  return <Box></Box>
}
