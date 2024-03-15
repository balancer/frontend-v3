import { BoxProps, Grid, GridItem, Heading, VStack } from '@chakra-ui/react'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { FeaturePoolCard } from './FeaturePoolCard'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'

const indexAreaHash: { [key: number]: string } = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
}

export async function FeaturedPools({ ...rest }: BoxProps) {
  const { projectName, supportedNetworks } = getProjectConfig()

  const featuredPoolsQuery = await getApolloServerClient().query({
    query: GetFeaturedPoolsDocument,
    variables: { chains: supportedNetworks },
    context: {
      fetchOptions: {
        next: { revalidate: 300 }, // 5 minutes
      },
    },
  })

  const queryData = featuredPoolsQuery.data.featuredPools || []

  const featuredPools = queryData.slice(0, 5)
  const primaryPool = featuredPools.find(featured => featured.primary)?.pool
  const poolsWithoutPrimary = featuredPools
    .filter(featured => !featured.primary)
    .map(featured => featured.pool)

  return (
    <VStack align="start" w="full" {...rest}>
      <Grid
        w="full"
        minH="600px"
        gap="4"
        alignContent="stretch"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)', // align with PoolListCards
        }}
        templateAreas={{
          base: `"primary"
                 "one"
                 "two"
                 "three"
                 "four"`,
          md: `"primary primary"
               "one     two"
               "three   four"`,
          lg: `"primary primary one   two"
               "primary primary three four"`, // align with PoolListCards
        }}
      >
        <GridItem area="primary">
          {primaryPool && (
            <VStack align="start" w="full" h="full" spacing="xl">
              <Heading as="h2" size="xl" variant="special">
                Featured pools on<br></br> {projectName} protocol
              </Heading>
              <FeaturePoolCard pool={primaryPool} chain={primaryPool.chain} hasLegend />
            </VStack>
          )}
        </GridItem>
        {poolsWithoutPrimary.map((pool, index) => (
          <GridItem key={index} area={indexAreaHash[index + 1]}>
            <FeaturePoolCard pool={pool} chain={pool.chain} isSmall />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  )
}
