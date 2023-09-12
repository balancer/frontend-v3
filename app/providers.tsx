import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ThemeProvider } from '@/lib/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/services/chakra/colorModeManager'
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode}>
      <ReactQueryProvider>
        <Web3Provider>
          <ApolloProviderWrapper>
            <TokensProvider>{children}</TokensProvider>
          </ApolloProviderWrapper>
        </Web3Provider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
