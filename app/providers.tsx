import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloClientProvider } from '@/lib/shared/services/api/apollo-client-provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { CurrentFlowStepProvider } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { ApolloGlobalDataProvider } from '@/lib/shared/services/api/apollo-global-data.provider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/useUserSettings'
import { ThemeProvider as ColorThemeProvider } from 'next-themes'
import { DEFAULT_THEME_COLOR_MODE } from '@/lib/shared/services/chakra/theme'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ColorThemeProvider defaultTheme={DEFAULT_THEME_COLOR_MODE}>
      <ThemeProvider>
        <Web3Provider>
          <ApolloClientProvider>
            <ApolloGlobalDataProvider>
              <UserSettingsProvider
                initCurrency={undefined}
                initSlippage={undefined}
                initEnableSignatures={undefined}
                initPoolListView={undefined}
                initAcceptedPolicies={undefined}
              >
                <CurrentFlowStepProvider>
                  <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
                </CurrentFlowStepProvider>
              </UserSettingsProvider>
            </ApolloGlobalDataProvider>
          </ApolloClientProvider>
        </Web3Provider>
      </ThemeProvider>
    </ColorThemeProvider>
  )
}
