import { Heading, Stack } from '@chakra-ui/react'
import { PoolListItem } from '../pool/pool.types'
import { PortfolioPoolsList } from './PortfolioPoolsList'

interface StakedPortfolioProps {
  pools: PoolListItem[]
  poolRewardsMap: Record<string, string>
}

export function StakedPortfolio({ pools }: StakedPortfolioProps) {
  return (
    <Stack width="full">
      <Heading>Staked portfolio</Heading>
      <PortfolioPoolsList pools={pools} isStaked />
    </Stack>
  )
}
