import { Box, BoxProps, Card, Grid, GridItem, Heading, VStack } from '@chakra-ui/react'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { FeaturePoolCard } from './FeaturePoolCard'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { MainZenSymbol } from '../pool/PoolDetail/PoolStats'
import PoolWeightChart from '../pool/PoolDetail/PoolWeightCharts/PoolWeightChart'

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
    <VStack alignItems="flex-start" spacing="4">
      <Heading as="h2" size="lg" variant="special">
        Featured pools
      </Heading>
      <Card
        variant="level2"
        width="full"
        height="550px"
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
          templateColumns="1fr 1fr 1fr 1fr"
          templateRows="1fr 1fr"
          p="4"
        >
          <GridItem position="relative" colSpan={2} rowSpan={2}>
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

        {/* <Grid */}
        {/*   w="full" */}
        {/*   minH="600px" */}
        {/*   gap="4" */}
        {/*   alignContent="stretch" */}
        {/*   templateColumns={{ */}
        {/*     base: 'repeat(1, 1fr)', */}
        {/*     md: 'repeat(2, 1fr)', */}
        {/*     lg: 'repeat(4, 1fr)', // align with PoolListCards */}
        {/*   }} */}
        {/*   templateAreas={{ */}
        {/*     base: `"primary" */}
        {/*            "one" */}
        {/*            "two" */}
        {/*            "three" */}
        {/*            "four"`, */}
        {/*     md: `"primary primary" */}
        {/*          "one     two" */}
        {/*          "three   four"`, */}
        {/*     lg: `"primary primary one   two" */}
        {/*          "primary primary three four"`, // align with PoolListCards */}
        {/*   }} */}
        {/* > */}
        {/*   <GridItem area="primary"> */}
        {/*     {primaryPool && ( */}
        {/*       <VStack align="start" w="full" h="full" spacing="xl"> */}
        {/*         <Heading as="h2" size="xl" variant="special"> */}
        {/*           Featured pools on<br></br> {projectName} protocol */}
        {/*         </Heading> */}
        {/*         <FeaturePoolCard pool={primaryPool} chain={primaryPool.chain} hasLegend /> */}
        {/*       </VStack> */}
        {/*     )} */}
        {/*   </GridItem> */}
        {/*   {poolsWithoutPrimary.map((pool, index) => ( */}
        {/*     <GridItem key={index} area={indexAreaHash[index + 1]}> */}
        {/*       <FeaturePoolCard pool={pool} chain={pool.chain} isSmall /> */}
        {/*     </GridItem> */}
        {/*   ))} */}
        {/* </Grid> */}
      </Card>
    </VStack>
  )
}
