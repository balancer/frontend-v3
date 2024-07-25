import { BoxProps, Card, Box, Text, HStack } from '@chakra-ui/react'
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

export function FeaturedPools({
  featuredPools,
}: {
  featuredPools: GetFeaturedPoolsQuery['featuredPools']
}) {
  return (
    <>
      <PoolCarousel
        featuredPools={featuredPools}
        display={{ base: 'block', md: 'none' }}
        w="full"
      />
      <Card
        display={{ base: 'none', md: 'flex' }}
        variant="level2"
        width="full"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box position="absolute" top="0">
          <Text
            color="font.secondary"
            variant="eyebrow"
            px="4"
            py="1.5"
            top="-2px"
            fontSize="11px"
            position="relative"
          >
            Featured pools
          </Text>
        </Box>
        <HStack w="full" pt="2" gap="md">
          {featuredPools.slice(0, 3).map((featured, index) => {
            return (
              <FeaturePoolCard
                key={index}
                pool={featured.pool}
                chain={featured.pool.chain}
                featuredReason={featured.description}
                isSmall
                bgSize="300px"
                svgIndex={index + 1}
              />
            )
          })}
        </HStack>
      </Card>
    </>
  )
}
