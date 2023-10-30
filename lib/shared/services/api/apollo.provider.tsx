'use client'

// eslint-disable-next-line max-len
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr'
import { createApolloClient } from '@/lib/shared/services/api/apollo.client'
// eslint-disable-next-line max-len
import { ApolloPrimeCacheProvider } from '@/lib/shared/services/api/apollo-prime-cache.provider'

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={createApolloClient}>
      <ApolloPrimeCacheProvider>{children}</ApolloPrimeCacheProvider>
    </ApolloNextAppProvider>
  )
}
