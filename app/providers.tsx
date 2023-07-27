'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Web3Provider>
        <ApolloProviderWrapper>
          <TokensProvider>{children}</TokensProvider>
        </ApolloProviderWrapper>
      </Web3Provider>
    </ThemeProvider>
  )
}
