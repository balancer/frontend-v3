'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import theme from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider
      theme={theme}
      cssVarsRoot="body"
      toastOptions={{ defaultOptions: { position: 'bottom-left' } }}
    >
      {children}
    </ChakraProvider>
  )
}
