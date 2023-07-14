import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ReactNode } from 'react'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Web3Provider>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </Web3Provider>
    </ThemeProvider>
  )
}
