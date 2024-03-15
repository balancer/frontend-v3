import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { FeaturedPoolsProvider } from '@/lib/modules/featuredPools/useFeaturedPools'
import { FeaturedPools } from '@/lib/modules/featuredPools/FeaturedPools'

export async function FeaturedPoolsWrapper() {
  const { supportedNetworks } = getProjectConfig()

  const variables = { chains: supportedNetworks }

  const { data } = await getApolloServerClient().query({
    query: GetFeaturedPoolsDocument,
    variables,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  })

  return (
    <FeaturedPoolsProvider data={data} variables={variables}>
      <FeaturedPools />
    </FeaturedPoolsProvider>
  )
}
