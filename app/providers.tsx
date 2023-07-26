'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloPageWrapper } from '@/lib/services/api/ApolloPageWrapper'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Web3Provider>
        <ApolloProviderWrapper>
          <ApolloPageWrapper>
            <TokensProvider>{children}</TokensProvider>
          </ApolloPageWrapper>
        </ApolloProviderWrapper>
      </Web3Provider>
    </ThemeProvider>
  )
}
