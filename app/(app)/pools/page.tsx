import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { FeaturedPools } from '@/lib/modules/featured-pools/FeaturedPools'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import FadeInOnView from '@/lib/shared/components/containers/FadeInOnView'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { Box, Skeleton } from '@chakra-ui/react'
import { Suspense } from 'react'

export default async function Pools() {
  const { supportedNetworks } = getProjectConfig()

  const featuredPoolsQuery = await getApolloServerClient().query({
    query: GetFeaturedPoolsDocument,
    variables: { chains: supportedNetworks },
    context: {
      fetchOptions: {
        next: { revalidate: 300 }, // 5 minutes
      },
    },
  })

  const featuredPools = featuredPoolsQuery.data.featuredPools || []

  return (
    <DefaultPageContainer>
      <Box>
        <FadeInOnView animateOnce={false}>
          <Box mb={{ base: '2xl', sm: '3xl' }}>
            <FeaturedPools featuredPools={featuredPools} />
          </Box>
        </FadeInOnView>
        <FadeInOnView animateOnce={false}>
          <Suspense fallback={<Skeleton w="full" h="500px" />}>
            <Box>
              <PoolList />
            </Box>
          </Suspense>
        </FadeInOnView>
      </Box>
    </DefaultPageContainer>
  )
}
