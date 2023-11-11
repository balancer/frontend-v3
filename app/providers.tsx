import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloClientProvider } from '@/lib/shared/services/api/apollo-client-provider'
import { ThemeProvider } from '@/lib/shared/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/shared/services/chakra/colorModeManager'
import { RecentTransactionsProvider } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { ApolloGlobalDataProvider } from '@/lib/shared/services/api/apollo-global-data.provider'
import { UserSettingsProvider } from '@/lib/modules/user/settings/useUserSettings'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode as 'light' | 'dark' | 'system'}>
      <Web3Provider>
        <ApolloClientProvider>
          <ApolloGlobalDataProvider>
            <UserSettingsProvider>
              <RecentTransactionsProvider>{children}</RecentTransactionsProvider>
            </UserSettingsProvider>
          </ApolloGlobalDataProvider>
        </ApolloClientProvider>
      </Web3Provider>
    </ThemeProvider>
  )
}
