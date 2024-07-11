'use client'

import { VStack, Image, Stack } from '@chakra-ui/react'
import { PoolComposition } from './PoolComposition/PoolComposition'
import { PoolActivityChart } from './PoolActivityChart/PoolActivityChart'
import { PoolInfoLayout } from './PoolInfo/PoolInfoLayout'
import { usePool } from '../PoolProvider'
import PoolMyLiquidity from './PoolMyLiquidity'
import { PoolStatsLayout } from './PoolStats/PoolStatsLayout'
import { PoolHeader } from './PoolHeader/PoolHeader'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { PoolAlerts } from '../alerts/PoolAlerts'
import { ClaimProvider } from '../actions/claim/ClaimProvider'
import { usePoolVariant } from '../pool.hooks'
import { useUserAccount } from '../../web3/UserAccountProvider'
import PoolUserEvents from './PoolUserEvents'
import { hasTotalBalance } from '../user-balance.helpers'
import { usePoolEvents } from '../usePoolEvents'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'

export function PoolDetail() {
  const { pool, chain } = usePool()
  const router = useRouter()
  const pathname = usePathname()
  const { variant, banners } = usePoolVariant()
  const { userAddress, isConnected } = useUserAccount()
  const {
    data: userPoolEventsData,
    startPolling,
    stopPolling,
  } = usePoolEvents({
    chainIn: [chain],
    poolIdIn: [pool.id],
    userAddress,
  })

  useEffect(() => {
    startPolling(120000)
    return () => stopPolling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userhasPoolEvents = useMemo(() => {
    if (userPoolEventsData) {
      return userPoolEventsData.poolEvents?.length > 0
    }
  }, [userPoolEventsData])

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
    <>
      <DefaultPageContainer>
        <ClaimProvider pools={[pool]}>
          <VStack w="full" spacing="2xl">
            <VStack w="full" spacing="md">
              <PoolAlerts />
              <PoolHeader />
              {banners?.headerSrc && <Image src={banners.headerSrc} alt={`${variant}-header`} />}
              <PoolStatsLayout />
            </VStack>
            {isConnected && (userHasLiquidity || userhasPoolEvents) && (
              <Stack
                w="full"
                spacing="md"
                direction={{ base: 'column', xl: 'row' }}
                justifyContent="stretch"
              >
                <PoolMyLiquidity />
                <PoolUserEvents />
              </Stack>
            )}
            <PoolActivityChart />
            <PoolComposition />
            <PoolInfoLayout />
          </VStack>
        </ClaimProvider>
      </DefaultPageContainer>
      {banners?.footerSrc && <Image src={banners.footerSrc} alt={`${variant}-footer`} />}
    </>
  )
}
