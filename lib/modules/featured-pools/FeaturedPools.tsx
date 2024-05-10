import { BoxProps, Card, Grid, GridItem, Heading, VStack, Box, Text } from '@chakra-ui/react'
import { FeaturePoolCard } from './FeaturePoolCard'
import { GetFeaturedPoolsQuery } from '@/lib/shared/services/api/generated/graphql'
import { PoolCarousel } from './PoolCarousel'

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
  const featuredPools = pools.slice(0, 5)

  const primaryPool =
    featuredPools.find(featured => featured.primary)?.pool || featuredPools[0].pool
  const poolsWithoutPrimary = featuredPools
    .filter(featured => !featured.primary)
    .map(featured => featured.pool)

  return (
    <VStack alignItems="flex-start" spacing="md">
      <PoolCarousel pools={featuredPools} display={{ base: 'block', md: 'none' }} w="full" />
      <Card
        display={{ base: 'none', md: 'flex' }}
        variant="level2"
        width="full"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box position="absolute" top="0">
          <Text color="font.secondary" variant="eyebrow" px="4" py="1.5" fontSize="11px">
            Featured pools
          </Text>
        </Box>
        <Grid
          columnGap="4"
          width="full"
          height="full"
          templateColumns="1fr 1fr 1fr"
          templateRows="1fr"
          p="0"
          pt="3"
        >
          <GridItem colSpan={1} rowSpan={1} role="group">
            <FeaturePoolCard
              pool={primaryPool}
              chain={primaryPool.chain}
              featuredReason="Liquid staked $SOL on an L2" //replace with {primaryPool.description} once API is updated
              isSmall
              bgSize="275px"
            />
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            {poolsWithoutPrimary[0] && (
              <FeaturePoolCard
                pool={poolsWithoutPrimary[0]}
                chain={poolsWithoutPrimary[0].chain}
                featuredReason="For LRT points maxxing" //replace with {poolsWithoutPrimary[0].description} once API is updated
                isSmall
                bgSize="300px"
              />
            )}
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            {poolsWithoutPrimary[1] && (
              <FeaturePoolCard
                pool={poolsWithoutPrimary[1]}
                chain={poolsWithoutPrimary[1].chain}
                featuredReason="For concentrated liquidity enjoyooors" //replace with {poolsWithoutPrimary[1].description} once API is updated
                isSmall
                bgSize="300px"
              />
            )}
          </GridItem>
        </Grid>
      </Card>
    </VStack>
  )
}
