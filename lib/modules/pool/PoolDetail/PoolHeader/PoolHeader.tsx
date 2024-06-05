import { Stack, Button } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import PoolMetaBadges from './PoolMetaBadges'
import { checkIfHasIssuesWithAddLiquidity } from '../../alerts/pool-issues/PoolIssue.rules'
import { usePool } from '../../PoolProvider'

export function PoolHeader() {
  const pathname = usePathname()
  const { pool } = usePool()

  const isAddLiquidityBlocked = checkIfHasIssuesWithAddLiquidity(pool)

  return (
    <Stack w="full" justify="space-between" direction={{ base: 'column', sm: 'row' }}>
      <PoolMetaBadges />
      {isAddLiquidityBlocked ? (
        <Button isDisabled={true} variant="primary" size="lg">
          Add liquidity
        </Button>
      ) : (
        <Button
          as={Link}
          href={`${pathname}/add-liquidity`}
          variant="primary"
          prefetch={true}
          size="lg"
        >
          Add liquidity
        </Button>
      )}
    </Stack>
  )
}
