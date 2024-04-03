'use client'

import { GqlPoolFeaturedPool } from '@/lib/shared/services/api/generated/graphql'
import { useState } from 'react'
import { Box, BoxProps, Card, Center } from '@chakra-ui/react'
import { FeaturePoolCard } from './FeaturePoolCard'
import { Pool } from '../pool/usePool'

type Props = {
  pools: GqlPoolFeaturedPool[]
}

export function PoolCarousel({ pools, ...rest }: Props & BoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('left')

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
    <Box {...rest}>
      <Card
        w="full"
        h="550px"
        pos="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box pos="absolute" w="8" h="full" top="0" left="0" cursor="pointer" onClick={prev} />
        <Box pos="absolute" w="8" h="full" top="0" right="0" cursor="pointer" onClick={next} />
        <FeaturePoolCard
          pool={currentPool}
          chain={currentPool.chain}
          bgSize="300px"
          hasLegend={false}
          isCarousel
          carouselIndex={currentIndex}
          carouselDirection={direction}
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
            mx="sm"
            transition="all 0.3s ease-in-out"
          />
        ))}
      </Center>
    </Box>
  )
}
