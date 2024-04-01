import { Badge, HStack } from '@chakra-ui/react'
import React from 'react'
import { usePool } from '../usePool'
import { isBoosted, isGyro, isStable, isWeighted } from '../pool.helpers'
import { GqlPoolUnion } from '@/lib/shared/services/api/generated/graphql'

function getPoolBadges(pool: GqlPoolUnion) {
  const badges = []

  if (pool.version === 2) badges.push('V3')
  if (pool.version === 1) badges.push('V2')
  if (isBoosted(pool.type)) badges.push('Boosted')
  if (isStable(pool.type)) badges.push('Stable')
  if (isGyro(pool.type)) badges.push('Gyro')
  if (isWeighted(pool.type)) badges.push('Weighted')

  return badges
}

export default function PoolBadges() {
  const { pool } = usePool()

  return (
    <HStack>
      {getPoolBadges(pool).map(badge => (
        <Badge variant="meta">{badge}</Badge>
      ))}
    </HStack>
  )
}
