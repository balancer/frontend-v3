import { Heading, Stack } from '@chakra-ui/react'
import { PoolListItem } from '../pool/pool.types'
import { PortfolioPoolsList } from './PortfolioPoolsList'
import { PoolRewardsDataMap } from './usePortfolio'

interface StakedPortfolioProps {
  pools: PoolListItem[]
  poolRewardsMap: PoolRewardsDataMap
}

export function StakedPortfolio({ pools, poolRewardsMap }: StakedPortfolioProps) {
  return (
    <Stack width="full">
      <Heading>Staked portfolio</Heading>
      <PortfolioPoolsList pools={pools} poolRewardsMap={poolRewardsMap} isStaked />
    </Stack>
  )
}
