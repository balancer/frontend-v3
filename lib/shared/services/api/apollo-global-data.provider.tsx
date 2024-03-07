/**
 * Apollo Global Data Provider
 *
 * This component is used to fetch data that is needed for the entire
 * application during the RSC render pass. The data is then passed to the client
 * providers that should then call `useSeedApolloCache` to seed the apollo cache
 * prior to the useQuery call, ensuring the data is already present on the first
 * client render pass.
 */
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import {
  GetTokenPricesDocument,
  GetTokensDocument,
} from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { TokensProvider } from '@/lib/modules/tokens/useTokens'
import { FiatFxRatesProvider } from '../../hooks/useFxRates'
import { getFxRates } from '../../utils/currencies'

export const revalidate = 60

export async function ApolloGlobalDataProvider({ children }: React.PropsWithChildren) {
  /*const client = getApolloServerClient()

  const tokensQueryVariables = {
    chains: getProjectConfig().supportedNetworks,
  }

  const { data: tokensQueryData } = await client.query({
    query: GetTokensDocument,
    variables: tokensQueryVariables,
    context: {
      fetchOptions: {
        next: { revalidate: 300 }, // 5 minutes, but this could potentially be longer
      },
    },
  })

  const { data: tokenPricesQueryData } = await client.query({
    query: GetTokenPricesDocument,
    variables: {
      chains: getProjectConfig().supportedNetworks,
    },
    context: {
      fetchOptions: {
        next: { revalidate: 60 },
      },
    },
  })*/

  const exchangeRates = await getFxRates()

  return (
    /*<TokensProvider
      tokensData={tokensQueryData}
      tokenPricesData={tokenPricesQueryData}
      variables={tokensQueryVariables}
    >*/
    <FiatFxRatesProvider data={exchangeRates}>{children}</FiatFxRatesProvider>
    /*</TokensProvider>*/
  )
}
