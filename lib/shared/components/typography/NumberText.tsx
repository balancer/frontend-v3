import { TextProps, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function NumberText({ children, ...rest }: PropsWithChildren & TextProps) {
  return (
    <Text style={{ fontVariantNumeric: 'tabular-nums ' }} {...rest}>
      {children}
    </Text>
  )
}
