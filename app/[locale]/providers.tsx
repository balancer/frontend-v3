import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { Web3Provider } from '@/lib/modules/web3/Web3Provider'
import { ApolloProviderWrapper } from '@/lib/services/api/apollo.provider'
import { ThemeProvider } from '@/lib/services/chakra/ThemeProvider'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { COLOR_MODE_STORAGE_KEY } from '@/lib/services/chakra/colorModeManager'
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl'

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode
  locale: string
  messages: AbstractIntlMessages
}) {
  const initialColorMode = cookies().get(COLOR_MODE_STORAGE_KEY)?.value

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider initialColorMode={initialColorMode}>
        <Web3Provider>
          <ApolloProviderWrapper>
            <TokensProvider>{children}</TokensProvider>
          </ApolloProviderWrapper>
        </Web3Provider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
