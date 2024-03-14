import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloClientProvider } from '@/lib/shared/services/api/apollo-client-provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { CurrentFlowStepProvider } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { ApolloGlobalDataProvider } from '@/lib/shared/services/api/apollo-global-data.provider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/useUserSettings'
import { ReactQueryClientProvider } from './react-query.provider'

export function Providers({ children }: { children: ReactNode }) {
  // const initialColorMode = cookies().get(COOKIE_KEYS.UserSettings.ColorMode)?.value
  // const initCurrency = cookies().get(COOKIE_KEYS.UserSettings.Currency)?.value
  // const initSlippage = cookies().get(COOKIE_KEYS.UserSettings.Slippage)?.value
  // const initEnableSignatures = cookies().get(COOKIE_KEYS.UserSettings.EnableSignatures)?.value
  // const initPoolListView = cookies().get(COOKIE_KEYS.UserSettings.PoolListView)?.value

  return (
    <ThemeProvider initialColorMode={'system'}>
      <Web3Provider>
        <ApolloClientProvider>
          <ApolloGlobalDataProvider>
            <UserSettingsProvider
              initCurrency={undefined}
              initSlippage={undefined}
              initEnableSignatures={undefined}
              initPoolListView={undefined}
            >
              <CurrentFlowStepProvider>
                <RecentTransactionsProvider>
                  <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
                </RecentTransactionsProvider>
              </CurrentFlowStepProvider>
            </UserSettingsProvider>
          </ApolloGlobalDataProvider>
        </ApolloClientProvider>
      </Web3Provider>
    </ThemeProvider>
  )
}
