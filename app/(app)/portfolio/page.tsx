'use client'
import Portfolio from '@/lib/modules/portfolio/Portfolio'
import { PortfolioProvider } from '@/lib/modules/portfolio/usePortfolio'

export default function PortfolioPage() {
  return (
    <PortfolioProvider>
      <Portfolio />
    </PortfolioProvider>
  )
}
