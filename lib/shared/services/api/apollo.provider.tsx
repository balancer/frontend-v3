'use client'

// eslint-disable-next-line max-len
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr'
import { createApolloClient } from '@/lib/shared/services/api/apollo.client'

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={createApolloClient}>{children}</ApolloNextAppProvider>
}
