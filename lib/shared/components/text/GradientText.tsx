import { Text, TextProps } from '@chakra-ui/react'
import React from 'react'

export default function GradientText({ children, ...rest }: TextProps) {
  return (
    <Text {...rest} >
      {children}
    </Text>
  )
}
