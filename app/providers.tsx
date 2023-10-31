import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/shared/services/api/apollo.provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/shared/services/chakra/colorModeManager'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { UrlParamProvider } from '@/lib/shared/providers/UrlParamProvider'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode}>
      <UrlParamProvider>
        <Web3Provider>
          <ApolloProviderWrapper>
            <TokensProvider>
              <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
            </TokensProvider>
          </ApolloProviderWrapper>
        </Web3Provider>
      </UrlParamProvider>
    </ThemeProvider>
  )
}
