'use client'

import { BoxProps, Card, Grid, GridItem, Heading, VStack } from '@chakra-ui/react'
import { FeaturePoolCard } from './FeaturePoolCard'
import { GetFeaturedPoolsQuery } from '@/lib/shared/services/api/generated/graphql'
import { PoolCarousel } from './PoolCarousel'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'

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

export function FeaturedPools({ pools }: { pools: GetFeaturedPoolsQuery['featuredPools'] }) {
  const { isMobile } = useBreakpoints()

  const featuredPools = pools.slice(0, 5)

  const primaryPool =
    featuredPools.find(featured => featured.primary)?.pool || featuredPools[0].pool
  const poolsWithoutPrimary = featuredPools
    .filter(featured => !featured.primary)
    .map(featured => featured.pool)

  return (
    <VStack alignItems="flex-start" spacing="md">
      <Heading as="h2" size="lg" variant="special">
        Featured pools
      </Heading>
      {isMobile ? (
        <PoolCarousel pools={featuredPools} />
      ) : (
        <Card
          variant="level2"
          width="full"
          height="550px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Grid
            columnGap="4"
            rowGap="4"
            width="full"
            height="full"
            templateColumns="1fr 1fr 1fr 1fr"
            templateRows="1fr 1fr"
            p="0"
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
                  bgSize="200px"
                />
              )}
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              {poolsWithoutPrimary[1] && (
                <FeaturePoolCard
                  pool={poolsWithoutPrimary[1]}
                  chain={poolsWithoutPrimary[1].chain}
                  isSmall
                  bgSize="200px"
                />
              )}
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              {poolsWithoutPrimary[2] && (
                <FeaturePoolCard
                  pool={poolsWithoutPrimary[2]}
                  chain={poolsWithoutPrimary[2].chain}
                  isSmall
                  bgSize="200px"
                />
              )}
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              {poolsWithoutPrimary[3] && (
                <FeaturePoolCard
                  pool={poolsWithoutPrimary[3]}
                  chain={poolsWithoutPrimary[3].chain}
                  isSmall
                  bgSize="200px"
                />
              )}
            </GridItem>
          </Grid>
        </Card>
      )}
    </VStack>
  )
}
