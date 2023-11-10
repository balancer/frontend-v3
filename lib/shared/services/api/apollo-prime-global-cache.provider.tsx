/**
 * Apollo Prime Cache Provider
 *
 * This component is used to prime the Apollo cache with data that is needed
 * for the entire application. This is useful for data that is needed on every
 * page, such as token data.
 */
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetTokensDocument } from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { TokensProvider } from '@/lib/modules/tokens/useTokens'

export async function ApolloPrimeGlobalCacheProvider({ children }: React.PropsWithChildren) {
  const client = getApolloServerClient()

  const tokensQueryVariables = {
    chains: getProjectConfig().supportedNetworks,
  }

  const { data: tokensQueryData } = await client.query({
    query: GetTokensDocument,
    variables: tokensQueryVariables,
  })

  return (
    <TokensProvider data={tokensQueryData} variables={tokensQueryVariables}>
      {children}
    </TokensProvider>
  )
}
