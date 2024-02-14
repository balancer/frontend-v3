import { HStack, Stack, Text } from '@chakra-ui/react'
import { PoolListItem } from '../pool/pool.types'
import { bn, fNum } from '@/lib/shared/utils/numbers'

interface PortfolioPoolsListProps {
  pools: PoolListItem[]
  isStaked?: boolean
}

function getBalance(pool: PoolListItem, isStaked: boolean) {
  const totalBalance = bn(pool.userBalance?.totalBalance || '0')
  const stakedBalance = bn(pool.userBalance?.stakedBalance || '0')
  return isStaked ? stakedBalance : totalBalance.minus(stakedBalance)
}

export function PortfolioPoolsList({ pools, isStaked = false }: PortfolioPoolsListProps) {
  return (
    <Stack>
      {pools.map(pool => (
        <HStack justifyContent="space-between" key={pool.id}>
          <Text>{pool.name}</Text>
          <Text>{fNum('token', getBalance(pool, isStaked))}</Text>
        </HStack>
      ))}
    </Stack>
  )
}
