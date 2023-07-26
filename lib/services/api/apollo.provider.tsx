'use client'

import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '@/lib/services/api/apollo.client'

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  const client = getApolloClient()

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
