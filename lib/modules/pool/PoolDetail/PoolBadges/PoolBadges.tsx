import GradientBadge from '@/lib/shared/components/badges/GradientBadge'
import GradientText from '@/lib/shared/components/text/GradientText'
import { Badge, HStack } from '@chakra-ui/react'
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
