import { Stack, Button } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import PoolMetaBadges from './PoolMetaBadges'

import { usePool } from '../../PoolProvider'
import { shouldBlockAddLiquidity } from '../../pool.helpers'
import { AnalyticsEvent, trackEvent } from '@/lib/shared/services/fathom/Fathom'
import { PoolCategories } from '../../categories/PoolCategores'

export function PoolHeader() {
  const pathname = usePathname()
  const { pool } = usePool()
  const router = useRouter()

  const isAddLiquidityBlocked = shouldBlockAddLiquidity(pool)

  function handleClick() {
    trackEvent(AnalyticsEvent.ClickAddLiquidity)
    router.push(`${pathname}/add-liquidity`)
  }

  return (
    <Stack w="full" justify="space-between" spacing="md" direction={{ base: 'column', sm: 'row' }}>
      <PoolMetaBadges />
      <PoolCategories />
      <Button onClick={handleClick} variant="primary" size="lg" isDisabled={isAddLiquidityBlocked}>
        Add liquidity
      </Button>
    </Stack>
  )
}
