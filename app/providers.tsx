'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Web3Provider>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </Web3Provider>
    </ThemeProvider>
  )
}
