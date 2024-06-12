'use client'

import { VStack, Image } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolInfoLayout } from './PoolInfo/PoolInfoLayout'
import { usePool } from '../PoolProvider'
import PoolMyLiquidity from './PoolMyLiquidity'
import { PoolStatsLayout } from './PoolStats/PoolStatsLayout'
import { PoolHeader } from './PoolHeader/PoolHeader'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PoolAlerts } from '../alerts/PoolAlerts'
import { ClaimProvider } from '../actions/claim/ClaimProvider'
import { usePoolVariant } from '../pool.hooks'
import { hasTotalBalance } from '../user-balance.helpers'

export function PoolDetail() {
  const { pool } = usePool()
  const router = useRouter()
  const pathname = usePathname()
  const { variant, banners } = usePoolVariant()

  const userHasLiquidity = hasTotalBalance(pool)

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

  return (
    <ClaimProvider pools={[pool]}>
      <VStack w="full" spacing="2xl">
        <VStack w="full" spacing="md">
          <PoolAlerts />
          <PoolHeader />
          {banners?.headerSrc && <Image src={banners.headerSrc} alt={`${variant}-header`} />}
          <PoolStatsLayout />
        </VStack>
        {userHasLiquidity && <PoolMyLiquidity />}
        <PoolActivityChart />
        <PoolComposition />
        <PoolInfoLayout />
        {banners?.footerSrc && <Image src={banners.footerSrc} alt={`${variant}-footer`} />}
      </VStack>
    </ClaimProvider>
  )
}
