import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloClientProvider } from '@/lib/shared/services/api/apollo-client-provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { ApolloGlobalDataProvider } from '@/lib/shared/services/api/apollo-global-data.provider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/UserSettingsProvider'
import { ThemeProvider as ColorThemeProvider } from 'next-themes'
import { DEFAULT_THEME_COLOR_MODE } from '@/lib/shared/services/chakra/themes/base/foundations'
import { wagmiConfig } from '@/lib/modules/web3/WagmiConfig'
import { GlobalAlertsProvider } from '@/lib/shared/components/alerts/GlobalAlertsProvider'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ColorThemeProvider defaultTheme={DEFAULT_THEME_COLOR_MODE}>
      <ThemeProvider>
        <GlobalAlertsProvider>
          <Web3Provider wagmiConfig={wagmiConfig}>
            <ApolloClientProvider>
              <ApolloGlobalDataProvider>
                <UserSettingsProvider>
                  <TransactionStateProvider>{children}</TransactionStateProvider>
                </UserSettingsProvider>
              </ApolloGlobalDataProvider>
            </ApolloClientProvider>
          </Web3Provider>
        </GlobalAlertsProvider>
      </ThemeProvider>
    </ColorThemeProvider>
  )
}
