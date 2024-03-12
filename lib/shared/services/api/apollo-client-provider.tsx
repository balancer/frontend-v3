'use client'

// eslint-disable-next-line max-len
import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@/lib/shared/services/api/apollo.client'

export function ApolloClientProvider({ children }: React.PropsWithChildren) {
  const client = createApolloClient()

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
