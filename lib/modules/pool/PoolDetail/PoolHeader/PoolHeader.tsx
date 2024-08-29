import { Stack, Button, VStack } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import PoolMetaBadges from './PoolMetaBadges'

import { usePool } from '../../PoolProvider'
import { shouldBlockAddLiquidity } from '../../pool.helpers'
import { AnalyticsEvent, trackEvent } from '@/lib/shared/services/fathom/Fathom'
import { PoolCategories } from '../../categories/PoolCategories'
import { PoolBreadcrumbs } from './PoolBreadcrumbs'

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
    <VStack align="start" w="full">
      <PoolBreadcrumbs />
      <Stack
        w="full"
        justify="space-between"
        spacing="md"
        direction={{ base: 'column', md: 'row' }}
      >
        <PoolMetaBadges />
        <Stack spacing="md" direction={{ base: 'column', md: 'row' }}>
          <PoolCategories />
          <Button
            onClick={handleClick}
            variant="primary"
            size="lg"
            isDisabled={isAddLiquidityBlocked}
          >
            Add liquidity
          </Button>
        </Stack>
      </Stack>
    </VStack>
  )
}
