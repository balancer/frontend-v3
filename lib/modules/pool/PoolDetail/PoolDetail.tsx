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
import { usePathname, useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'
import { ThemeContext } from '@/lib/shared/services/chakra/ThemeProvider'

export function PoolDetail() {
  const { pool } = usePool()
  const router = useRouter()
  const pathname = usePathname()
  const { toggleTheme } = useContext(ThemeContext)

  const userHasLiquidity = bn(pool.userBalance?.totalBalance || '0').gt(0)

  useEffect(() => {
    // Prefetch pool action pages.
    router.prefetch(`${pathname}/add-liquidity`)
    if (userHasLiquidity) {
      router.prefetch(`${pathname}/remove-liquidity`)
      router.prefetch(`${pathname}/stake-liquidity`)
      router.prefetch(`${pathname}/unstake-liquidity`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  useEffect(() => {
    toggleTheme('gyro')
  }, [])

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
