'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import theme from './theme'

export function ThemeProvider({
  children,
}: {
  children: ReactNode
  initialColorMode?: 'light' | 'dark' | 'system'
}) {
  return (
    <>
      <ChakraProvider theme={theme} cssVarsRoot="body">
        {children}
      </ChakraProvider>
    </>
  )
}
