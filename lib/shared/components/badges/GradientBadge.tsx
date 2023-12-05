import { Badge, BadgeProps, Text } from '@chakra-ui/react'
import React from 'react'

export default function GradientBadge({ children, ...rest }: BadgeProps) {
  return (
    <Badge
      {...rest}
      backgroundColor="lightBadge"
      _dark={{ backgroundColor: 'background.card.level5' }}
      p="1"
    >
      <Text
        _dark={{ bg: 'font.secondary', bgClip: 'text' }}
        bg="font.primary"
        bgClip="text"
        fontSize="sm"
        fontWeight="medium"
        textTransform="capitalize"
      >
        {children}
      </Text>
    </Badge>
  )
}
