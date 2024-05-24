import { Stack, Button } from '@chakra-ui/react'
import PoolMetaBadges from './PoolMetaBadges/PoolMetaBadges'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function PoolHeader() {
  const pathname = usePathname()

  return (
    <Stack w="full" justify="space-between" direction={{ base: 'column', sm: 'row' }}>
      <PoolMetaBadges />
      <Button
        as={Link}
        href={`${pathname}/add-liquidity`}
        variant="primary"
        prefetch={true}
        size="lg"
      >
        Add liquidity
      </Button>
    </Stack>
  )
}
