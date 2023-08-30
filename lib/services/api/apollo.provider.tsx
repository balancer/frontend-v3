'use client'

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr'
import { createApolloClient } from '@/lib/services/api/apollo.client'
import { ApolloPrimeCacheProvider } from '@/lib/services/api/apollo-prime-cache.provider'

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={createApolloClient}>
      <ApolloPrimeCacheProvider>{children}</ApolloPrimeCacheProvider>
    </ApolloNextAppProvider>
  )
}
