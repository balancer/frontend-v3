import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloClientProvider } from '@/lib/shared/services/api/apollo-client-provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { ApolloGlobalDataProvider } from '@/lib/shared/services/api/apollo-global-data.provider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/useUserSettings'
import { COOKIE_KEYS } from '@/lib/modules/cookies/cookie.constants'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = cookies().get(COOKIE_KEYS.UserSettings.ColorMode)?.value
  const initCurrency = cookies().get(COOKIE_KEYS.UserSettings.Currency)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode as 'light' | 'dark' | 'system'}>
      <Web3Provider>
        <ApolloClientProvider>
          <ApolloGlobalDataProvider>
            <UserSettingsProvider initCurrency={initCurrency}>
              <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
            </UserSettingsProvider>
          </ApolloGlobalDataProvider>
        </ApolloClientProvider>
      </Web3Provider>
    </ThemeProvider>
  )
}
