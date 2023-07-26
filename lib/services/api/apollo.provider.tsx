'use client'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/services/api/apollo.client'

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  return <ApolloProvider client={apolloClient()}>{children}</ApolloProvider>
}
