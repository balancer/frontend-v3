'use client'
import { Stack } from '@chakra-ui/react'
import { PortfolioSummary } from './PortfolioSummary'
import { PortfolioTable } from './PortfolioTable/PortfolioTable'
import { ClaimNetworkPools } from './PortfolioClaim/ClaimNetworkPools/ClaimNetworkPools'

export default function Portfolio() {
  return (
    <Stack width="full" gap={20}>
      <PortfolioSummary />
      <ClaimNetworkPools />
      <PortfolioTable />
    </Stack>
  )
}
