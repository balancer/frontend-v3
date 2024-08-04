'use client'

import { TokenBalancesProvider } from '@/lib/modules/tokens/TokenBalancesProvider'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'

type Props = {
  children: React.ReactNode
}

export default function VebalLayout({ children }: Props) {
  const { getTokensByChain } = useTokens()

  const tokens = getTokensByChain(1)

  return (
    <TokenBalancesProvider extTokens={tokens}>
      <DefaultPageContainer minH="100vh">{children}</DefaultPageContainer>
    </TokenBalancesProvider>
  )
}
