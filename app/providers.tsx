'use client'

import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/providers/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ThemeProvider } from '@/lib/services/chakra/ThemeProvider'
import { ReactNode, useState } from 'react'
// import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/services/chakra/colorModeManager'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: ReactNode }) {
  // const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider initialColorMode={'light'}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <ApolloProviderWrapper>
            <TokensProvider>{children}</TokensProvider>
          </ApolloProviderWrapper>
        </Web3Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
