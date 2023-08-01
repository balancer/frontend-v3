'use client'

import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import ThemeProvider from '@/lib/services/chakra/ThemeProvider'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Web3Provider>
        <ApolloProviderWrapper>
          <TokensProvider>{children}</TokensProvider>
        </ApolloProviderWrapper>
      </Web3Provider>
    </ThemeProvider>
  )
}
