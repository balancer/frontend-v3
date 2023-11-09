import GradientBadge from '@/lib/shared/components/badges/GradientBadge'
import { HStack } from '@chakra-ui/react'
import React from 'react'

export default function PoolBadges() {
  return (
    <HStack>
      <GradientBadge>V3</GradientBadge>
      <GradientBadge>Boosted</GradientBadge>
      <GradientBadge>Immutable*</GradientBadge>
    </HStack>
  )
}
