import { getApolloClient } from '@/lib/services/api/apollo.client'
// eslint-disable-next-line max-len
import { ApolloClientSidePageWrapper } from '@/lib/services/api/ApolloClientSidePageWrapper'
import { GetAppGlobalDataDocument } from '@/lib/services/api/generated/graphql'

export async function ApolloPageWrapper({ children }: React.PropsWithChildren) {
  const client = getApolloClient()

  await client.query({ query: GetAppGlobalDataDocument })

  return (
    <ApolloClientSidePageWrapper
      cache={JSON.parse(JSON.stringify(client.cache.extract()))}
    >
      {children}
    </ApolloClientSidePageWrapper>
  )
}
