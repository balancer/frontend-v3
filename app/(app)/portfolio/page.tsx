'use client'

import { ClaimProvider } from '@/lib/modules/pool/actions/claim/ClaimProvider'
import Portfolio from '@/lib/modules/portfolio/Portfolio'
import { usePortfolio } from '@/lib/modules/portfolio/PortfolioProvider'

export default function PortfolioPage() {
  const { pools } = usePortfolio()

  return (
    <ClaimProvider pools={pools}>
      <Portfolio />
    </ClaimProvider>
  )
}
