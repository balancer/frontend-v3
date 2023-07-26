'use client'

import { getApolloClient } from '@/lib/services/api/apollo.client'

interface Props extends React.PropsWithChildren {
  cache: any
}

export async function ApolloClientSidePageWrapper({ cache, children }: Props) {
  const client = getApolloClient()

  client.cache.restore(cache)

  return <>{children}</>
}
