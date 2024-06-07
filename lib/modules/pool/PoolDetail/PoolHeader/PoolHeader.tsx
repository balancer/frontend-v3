import { Stack, Button } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import PoolMetaBadges from './PoolMetaBadges'

import { usePool } from '../../PoolProvider'
import { shouldBlockAddLiquidity } from '../../pool.helpers'

export function PoolHeader() {
  const pathname = usePathname()
  const { pool } = usePool()

  const isAddLiquidityBlocked = shouldBlockAddLiquidity(pool)

  return (
    <Stack w="full" justify="space-between" direction={{ base: 'column', sm: 'row' }}>
      <PoolMetaBadges />
      <Button
        as={Link}
        href={isAddLiquidityBlocked ? '' : `${pathname}/add-liquidity`}
        variant="primary"
        prefetch={true}
        size="lg"
        isDisabled={isAddLiquidityBlocked}
      >
        Add liquidity
      </Button>
    </Stack>
  )
}
