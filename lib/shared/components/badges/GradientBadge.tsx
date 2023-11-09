import { Badge, BadgeProps, Text } from '@chakra-ui/react'
import React from 'react'

export default function GradientBadge({ children, ...rest }: BadgeProps) {
  return (
    <Badge {...rest} backgroundColor="badge" p="1">
      <Text variant="heading" fontSize="sm" fontWeight="medium" textTransform="capitalize">
        {children}
      </Text>
    </Badge>
  )
}
