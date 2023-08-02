'use client'

import { ChakraProvider, ChakraTheme, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { CacheProvider as ChakraCacheProvider } from '@chakra-ui/next-js'
import { ReactNode } from 'react'

const customTheme: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
}

export const theme = extendTheme(customTheme)

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
