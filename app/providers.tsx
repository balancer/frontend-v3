import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloClientProvider } from '@/lib/shared/services/api/apollo-client-provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
// import { cookies } from 'next/headers'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { ApolloGlobalDataProvider } from '@/lib/shared/services/api/apollo-global-data.provider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/useUserSettings'
// import { COOKIE_KEYS } from '@/lib/modules/cookies/cookie.constants'
import { ReactQueryClientProvider } from './react-query.provider'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = 'light' //cookies().get(COOKIE_KEYS.UserSettings.ColorMode)?.value
  const initCurrency = 'USD' //cookies().get(COOKIE_KEYS.UserSettings.Currency)?.value
  const initSlippage = '0.5' //cookies().get(COOKIE_KEYS.UserSettings.Slippage)?.value
  const initEnableSignatures = 'yes' // cookies().get(COOKIE_KEYS.UserSettings.EnableSignatures)?.value
  const initPoolListView = 'list' //cookies().get(COOKIE_KEYS.UserSettings.PoolListView)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode as 'light' | 'dark' | 'system'}>
      <Web3Provider>
        <ApolloClientProvider>
          <ApolloGlobalDataProvider>
            <UserSettingsProvider
              initCurrency={initCurrency}
              initSlippage={initSlippage}
              initEnableSignatures={initEnableSignatures}
              initPoolListView={initPoolListView}
            >
              <RecentTransactionsProvider>
                <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
              </RecentTransactionsProvider>
            </UserSettingsProvider>
          </ApolloGlobalDataProvider>
        </ApolloClientProvider>
      </Web3Provider>
    </ThemeProvider>
  )
}
