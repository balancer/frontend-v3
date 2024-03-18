import { FeaturedPools } from '@/lib/modules/featuredPools/FeaturedPools'
import { PropsWithChildren } from 'react'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'

export default async function PoolsLayout({ children }: PropsWithChildren) {
  const { supportedNetworks } = getProjectConfig()

  const { data: featuredPools } = await getApolloServerClient().query({
    query: GetFeaturedPoolsDocument,
    variables: { chains: supportedNetworks },
    context: {
      fetchOptions: {
        next: { revalidate: 300 }, // 5 minutes
      },
    },
  })

  return (
    <>
      <FeaturedPools data={featuredPools} mb="xl" />
      {children}
    </>
  )
}
