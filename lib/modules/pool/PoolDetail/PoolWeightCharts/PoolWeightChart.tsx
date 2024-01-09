import { Box } from '@chakra-ui/react'
import React from 'react'
import { usePool } from '../../usePool'
import WeightedPoolWeightChart from './WeightedPoolWeightChart'

export default function PoolWeightChart() {
  const { pool } = usePool()

  if (pool.type === 'WEIGHTED') {
    return <WeightedPoolWeightChart />
  }
  return <Box></Box>
}
