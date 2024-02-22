import { Heading, Stack } from '@chakra-ui/react'
import { PoolListItem } from '../pool/pool.types'
import { PortfolioPoolsList } from './PortfolioPoolsList'

interface UnstakedPortfolioProps {
  pools: PoolListItem[]
}

export function UnstakedPortfolio({ pools }: UnstakedPortfolioProps) {
  return (
    <Stack width="full">
      <Heading>Unstaked portfolio</Heading>
      <PortfolioPoolsList pools={pools} />
    </Stack>
  )
}
