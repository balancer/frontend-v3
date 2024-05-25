'use client'

import { VStack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolInfoLayout } from './PoolInfo/PoolInfoLayout'
import { usePool } from '../PoolProvider'
import PoolMyLiquidity from './PoolMyLiquidity'
import { bn } from '@/lib/shared/utils/numbers'
import { PoolStatsLayout } from './PoolStats/PoolStatsLayout'
import { PoolHeader } from './PoolHeader/PoolHeader'

export function PoolDetail() {
  const { pool } = usePool()

  const userHasLiquidity = bn(pool.userBalance?.totalBalance || '0').gt(0)

  return (
    <VStack w="full" spacing="2xl">
      <VStack w="full" spacing="md">
        <PoolHeader />
        <PoolStatsLayout />
      </VStack>
      <PoolActivityChart />
      <PoolComposition />
      {userHasLiquidity && <PoolMyLiquidity />}
      <PoolInfoLayout />
    </VStack>
  )
}
