'use client'

// eslint-disable-next-line max-len
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr'
import { createApolloClient } from '@/lib/shared/services/api/apollo.client'
import { GetAppGlobalDataQuery } from '@/lib/shared/services/api/generated/graphql'
import { ApolloPrimeCacheProvider } from '@/lib/shared/services/api/apollo-prime-cache.provider'

interface Props extends React.PropsWithChildren {
  data: GetAppGlobalDataQuery
}

export function ApolloClientProviderWrapper({ children, data }: Props) {
  return (
    <ApolloNextAppProvider makeClient={createApolloClient}>
      <ApolloPrimeCacheProvider data={data}>{children}</ApolloPrimeCacheProvider>
    </ApolloNextAppProvider>
  )
}
