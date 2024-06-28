'use client'

import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { FeaturedPool, Pool } from '../pool/PoolProvider'
import { useRouter } from 'next/navigation'
import { VStack, Text, Box, HStack } from '@chakra-ui/react'
import {
  poolClickHandler,
  poolMouseEnterHandler,
  getPoolTypeLabel,
  getTotalAprLabel,
} from '../pool/pool.utils'
import { PoolName } from '../pool/PoolName'
import { NoisyCard } from '@/lib/shared/components/containers/NoisyCard'
import { PoolZenGarden } from '@/lib/shared/components/zen/ZenGarden'
import { motion } from 'framer-motion'
import { FeaturedPoolWeightChart } from '../pool/PoolDetail/PoolWeightCharts/FeaturedPoolWeightChart'
import MainAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { memo } from 'react'

interface Props {
  pool: FeaturedPool
  chain: GqlChain
  bgSize?: string
  isSmall?: boolean
  hasLegend?: boolean
  isCarousel?: boolean
  carouselDirection?: 'left' | 'right'
  carouselIndex?: number
  featuredReason?: string
}

const slideVariants = {
  hiddenRight: {
    x: '100%',
    opacity: 0,
  },
  hiddenLeft: {
    x: '-100%',
    opacity: 0,
  },
  visible: {
    x: '0',
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturePoolCard({
  pool,
  chain,
  featuredReason,
  bgSize = '500px',
  isSmall = false,
  hasLegend = false,
  isCarousel = false,
  carouselDirection = 'left',
  carouselIndex = 1,
}: Props) {
  const router = useRouter()

  const MemoizedMainAprTooltip = memo(MainAprTooltip)

  const anim = isCarousel
    ? {
        initial: carouselDirection === 'left' ? 'hiddenLeft' : 'hiddenRight',
        animate: 'visible',
        exit: 'exit',
        variants: slideVariants,
      }
    : {}

  return (
    <NoisyCard
      cardProps={{
        position: 'relative',
        overflow: 'hidden',
        onClick: event => poolClickHandler(event, pool as Pool, router),
        onMouseEnter: event => poolMouseEnterHandler(event, pool as Pool, router),
        cursor: 'pointer',
        _hover: { bg: 'background.base' },
      }}
      contentProps={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        key={carouselIndex}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '1.5rem 0.5rem',
          transition: 'all 0.2s var(--ease-out-cubic)',
        }}
        {...anim}
        role="group"
      >
        <VStack cursor="pointer" justifyContent="center" spacing={isSmall ? 'sm' : 'md'} h="full">
          <VStack spacing="4">
            <Box
              textAlign="center"
              transform="translateY(4px)"
              _groupHover={{ opacity: '1', transform: 'translateY(0)' }}
              transition="all 0.3s var(--ease-out-cubic)"
              css={{
                '@media(pointer: fine)': {
                  opacity: '0',
                },
                '@media(pointer: coarse)': {
                  opacity: '1',
                },
              }}
            >
              <Text variant="special" fontWeight="bold" fontSize="sm" textAlign="center" mb="1">
                {featuredReason}
              </Text>
            </Box>
            <Box>
              <FeaturedPoolWeightChart
                pool={pool}
                chain={chain}
                hasLegend={hasLegend}
                isSmall={isSmall}
              />
            </Box>
            <VStack spacing="0" zIndex={1}>
              <HStack mb="1" gap="0">
                <PoolName pool={pool} fontSize="md" noOfLines={1} />
                <MemoizedMainAprTooltip
                  poolId={pool.id}
                  aprItems={pool.dynamicData.aprItems}
                  pool={pool}
                  onlySparkles
                  id={`featured-${pool.id.slice(2, 6)}`}
                />
              </HStack>
              <Text mb="0.5" variant="secondary" fontWeight="medium" fontSize="sm">
                {getPoolTypeLabel(pool.type)} pool
              </Text>
            </VStack>
          </VStack>
        </VStack>
        <PoolZenGarden repetitions={10} subdued={isSmall} sizePx={bgSize} poolType={pool.type} />
      </motion.div>
    </NoisyCard>
  )
}
