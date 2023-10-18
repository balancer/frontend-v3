import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ThemeProvider } from '@/lib/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/services/chakra/colorModeManager'
import { ClientProviders } from '@/app/client-providers'
import { UserDataProvider } from '@/lib/modules/user/useUserData'

export function Providers({ children }: { children: ReactNode }) {
  const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value

  return (
    <ThemeProvider initialColorMode={initialColorMode}>
      <ClientProviders>
        <Web3Provider>
          <ApolloProviderWrapper>
            <TokensProvider>
              <UserDataProvider>{children}</UserDataProvider>
            </TokensProvider>
          </ApolloProviderWrapper>
        </Web3Provider>
      </ClientProviders>
    </ThemeProvider>
  )
}
