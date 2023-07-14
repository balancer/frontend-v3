'use client'

import { ApolloProvider } from '@apollo/client'
import { useApollo } from '@/lib/services/api/client'

export function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  const client = useApollo()

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
