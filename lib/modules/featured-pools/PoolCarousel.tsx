'use client'

import { GetFeaturedPoolsQuery } from '@/lib/shared/services/api/generated/graphql'
import { useState } from 'react'
import { Box, BoxProps, Card, Center, Text } from '@chakra-ui/react'
import { FeaturePoolCard } from './FeaturePoolCard'
import { Pool } from '../pool/PoolProvider'
import { useSwipeable } from 'react-swipeable'

type Props = {
  pools: GetFeaturedPoolsQuery['featuredPools']
}

export function PoolCarousel({ pools, ...rest }: Props & BoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
  })

  function next() {
    setDirection('right')
    setCurrentIndex(prevIndex => (prevIndex + 1 === pools.length ? 0 : prevIndex + 1))
  }

  function prev() {
    setDirection('left')
    setCurrentIndex(prevIndex => (prevIndex - 1 < 0 ? pools.length - 1 : prevIndex - 1))
  }

  function pick(index: number) {
    setDirection(index > currentIndex ? 'right' : 'left')
    setCurrentIndex(index)
  }

  const currentPool = pools[currentIndex].pool as Pool

  return (
    <Box {...swipeHandlers} {...rest}>
      <Card
        w="full"
        pos="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        paddingTop="26px !important"
      >
        <Box position="absolute" top="0">
          <Text color="font.secondary" variant="eyebrow" px="4" py="1.5" fontSize="10px">
            Featured pools
          </Text>
        </Box>
        <Box pos="absolute" w="8" h="full" top="0" left="0" cursor="pointer" onClick={prev} />
        <Box pos="absolute" w="8" h="full" top="0" right="0" cursor="pointer" onClick={next} />
        <FeaturePoolCard
          pool={currentPool}
          chain={currentPool.chain}
          bgSize="300px"
          hasLegend={false}
          isCarousel
          isSmall
          carouselIndex={currentIndex}
          carouselDirection={direction}
          featuredReason="Liquid staked $SOL on an L2" //replace with {currentPool.description} once API is updated
        />
      </Card>
      <Center w="full" mt="md">
        {pools.map((pool, index) => (
          <Box
            key={pool.pool.id}
            w="3"
            h="3"
            bg={index === currentIndex ? 'font.highlight' : 'border.base'}
            borderRadius="full"
            cursor="pointer"
            onClick={() => pick(index)}
            mx="xs"
            transition="all 0.2s ease-out"
          />
        ))}
      </Center>
    </Box>
  )
}
