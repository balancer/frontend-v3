'use client'

import { GqlPoolFeaturedPool } from '@/lib/shared/services/api/generated/graphql'
import { useState } from 'react'
import { Box, Card, Center } from '@chakra-ui/react'
import { FeaturePoolCard } from './FeaturePoolCard'
import { Pool } from '../pool/usePool'

type Props = {
  pools: GqlPoolFeaturedPool[]
}

export function PoolCarousel({ pools }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  function next() {
    setCurrentIndex(prevIndex => (prevIndex + 1 === pools.length ? 0 : prevIndex + 1))
  }

  function prev() {
    setCurrentIndex(prevIndex => (prevIndex - 1 < 0 ? pools.length - 1 : prevIndex - 1))
  }

  function pick(index: number) {
    setCurrentIndex(index)
  }

  const currentPool = pools[currentIndex].pool as Pool

  return (
    <>
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
        />
      </Card>
      <Center w="full" mt="sm">
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
    </>
  )
}
