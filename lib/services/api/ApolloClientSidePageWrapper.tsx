'use client'

import { apolloClient } from '@/lib/services/api/apollo.client'

interface Props extends React.PropsWithChildren {
  cache: any
}

export async function ApolloClientSidePageWrapper({ cache, children }: Props) {
  apolloClient().cache.restore(cache)

  return <>{children}</>
}
