'use client'
import { Stack } from '@chakra-ui/react'
import { PortfolioSummary } from './PortfolioSummary/PortfolioSummary'
import { PortfolioTable } from './PortfolioTable/PortfolioTable'
import { PortfolioNetworkClaim } from './PortfolioClaim/PortfolioNetworkClaim/PortfolioNetworkClaim'

export default function Portfolio() {
  return (
    <Stack width="full" gap={20}>
      <PortfolioSummary />
      <PortfolioNetworkClaim />
      <PortfolioTable />
    </Stack>
  )
}
