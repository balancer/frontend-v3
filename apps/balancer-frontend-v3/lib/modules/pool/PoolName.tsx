import { fNum } from '@/lib/shared/utils/numbers'
import { PoolListItem } from './pool.types'
import { HStack, Text, TextProps, Box } from '@chakra-ui/react'
import { FeaturedPool, Pool } from './PoolProvider'

interface PoolNameProps extends TextProps {
  pool: PoolListItem | Pool | FeaturedPool
  MemoizedMainAprTooltip?: React.ComponentType<any>
  isCarousel?: boolean
}

// Type guard function to check if pool is FeaturedPool
function isFeaturedPool(pool: PoolListItem | Pool | FeaturedPool): pool is FeaturedPool {
  return (pool as FeaturedPool).dynamicData !== undefined
}

export function PoolName({ pool, MemoizedMainAprTooltip, isCarousel, ...rest }: PoolNameProps) {
  const displayTokens = pool.displayTokens

  return (
    <HStack alignItems="center" gap="xxs" justify="start" px="sm" wrap="wrap">
      {displayTokens.map((token, idx) => {
        return (
          <HStack alignItems="center" gap="xxs" justify="center" key={token.address}>
            <Text as="span" fontWeight="bold" {...rest} fontSize="sm" lineHeight="1">
              {token.nestedTokens ? token.name : token.symbol}
              {token.weight ? ` ${fNum('weight', token.weight || '')}` : null}
            </Text>
            <Text {...rest} lineHeight="1">
              {idx <= displayTokens.length - 2 && '/'}
            </Text>
          </HStack>
        )
      })}
      {isFeaturedPool(pool) && MemoizedMainAprTooltip ? (
        <Box
          _hover={{ transform: 'scale(1.1)' }}
          transform="scale(0.9)"
          transition="transform 0.2s var(--ease-out-cubic)"
          width="0"
        >
          <MemoizedMainAprTooltip
            aprItems={pool.dynamicData.aprItems}
            id={`featured-${isCarousel ? 'mobile' : 'desktop'}`}
            onlySparkles
            pool={pool}
            poolId={pool.id}
          />
        </Box>
      ) : null}
    </HStack>
  )
}
