'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { usePartnerTheme } from './PartnerThemeProvider'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = usePartnerTheme()

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
