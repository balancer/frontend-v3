import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProvider } from '@/lib/shared/services/api/apollo.provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/shared/services/chakra/colorModeManager'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { ApolloPrimeGlobalCacheProvider } from '@/lib/shared/services/api/apollo-prime-global-cache.provider'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode}>
      <Web3Provider>
        <ApolloProvider>
          <ApolloPrimeGlobalCacheProvider>
            <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
          </ApolloPrimeGlobalCacheProvider>
        </ApolloProvider>
      </Web3Provider>
    </ThemeProvider>
  )
}
