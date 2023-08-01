'use client'

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { CacheProvider as ChakraCacheProvider } from '@chakra-ui/next-js'
import { ReactNode } from 'react'

export const theme = extendTheme()

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraCacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </ChakraCacheProvider>
    </>
  )
}
