import { PortfolioProvider } from '@/lib/modules/portfolio/usePortfolio'

type Props = {
  children: React.ReactNode
}

export default function PortfolioLayout({ children }: Props) {
  return <PortfolioProvider>{children}</PortfolioProvider>
}
