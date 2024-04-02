import { BoxProps, Card, Grid, GridItem, Heading, VStack } from '@chakra-ui/react'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { FeaturePoolCard } from './FeaturePoolCard'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'

export const commonNoisyCardProps: { contentProps: BoxProps; cardProps: BoxProps } = {
  contentProps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardProps: {
    position: 'relative',
    overflow: 'hidden',
  },
}

export async function FeaturedPools() {
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

  const queryData = featuredPoolsQuery.data.featuredPools || []

  const featuredPools = queryData.slice(0, 5)
  const primaryPool = featuredPools.find(featured => featured.primary)?.pool
  const poolsWithoutPrimary = featuredPools
    .filter(featured => !featured.primary)
    .map(featured => featured.pool)

  return (
    <VStack alignItems="flex-start" spacing="4">
      <Heading as="h2" size="lg" variant="special">
        Featured pools
      </Heading>
      <Card
        variant="level2"
        width="full"
        height={{ base: 'auto', md: '550px' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        shadow="2xl"
        borderWidth={0}
      >
        <Grid
          columnGap="4"
          rowGap="4"
          width="full"
          height="full"
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          templateRows={{ base: 'repeat(4, 1fr)', md: '1fr 1fr' }}
          p="0"
        >
          <GridItem position="relative" gridArea="1 / 1 / 3 / 3">
            {primaryPool && (
              <FeaturePoolCard pool={primaryPool} chain={primaryPool.chain} hasLegend />
            )}
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            {poolsWithoutPrimary[0] && (
              <FeaturePoolCard
                pool={poolsWithoutPrimary[0]}
                chain={poolsWithoutPrimary[0].chain}
                isSmall
              />
            )}
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            {poolsWithoutPrimary[1] && (
              <FeaturePoolCard
                pool={poolsWithoutPrimary[1]}
                chain={poolsWithoutPrimary[1].chain}
                isSmall
              />
            )}
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            {poolsWithoutPrimary[2] && (
              <FeaturePoolCard
                pool={poolsWithoutPrimary[2]}
                chain={poolsWithoutPrimary[2].chain}
                isSmall
              />
            )}
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            {poolsWithoutPrimary[3] && (
              <FeaturePoolCard
                pool={poolsWithoutPrimary[3]}
                chain={poolsWithoutPrimary[3].chain}
                isSmall
              />
            )}
          </GridItem>
        </Grid>
      </Card>
    </VStack>
  )
}
