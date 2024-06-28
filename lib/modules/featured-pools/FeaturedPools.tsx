import { BoxProps, Card, Box, Text, HStack } from '@chakra-ui/react'
import { FeaturePoolCard } from './FeaturePoolCard'
import { GetFeaturedPoolsQuery } from '@/lib/shared/services/api/generated/graphql'
import { PoolCarousel } from './PoolCarousel'
import { Pool } from '../pool/PoolProvider'

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
  const featuredPools = pools.map(p => p.pool as Pool).slice(0, 3)

  return (
    <>
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
        <HStack w="full" pt="2">
          {featuredPools.map((pool, index) => {
            return (
              <FeaturePoolCard
                key={index}
                pool={pool}
                chain={pool.chain}
                featuredReason="Liquid staked $SOL on Arbitrum" //replace with {primaryPool.description} once API is updated
                isSmall
                bgSize="300px"
              />
            )
          })}
        </HStack>
      </Card>
    </>
  )
}
