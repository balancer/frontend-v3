import { ApolloClientProviderWrapper } from '@/lib/shared/services/api/apollo-client.provider'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetAppGlobalDataDocument } from '@/lib/shared/services/api/generated/graphql'

export async function ApolloProviderWrapper({ children }: React.PropsWithChildren) {
  const { data } = await getApolloServerClient().query({ query: GetAppGlobalDataDocument })

  return <ApolloClientProviderWrapper data={data}>{children}</ApolloClientProviderWrapper>
}
