'use client'

import {
  ChakraProvider,
  ChakraTheme,
  ColorModeScript,
  extendTheme,
} from '@chakra-ui/react'
import { CacheProvider as ChakraCacheProvider } from '@chakra-ui/next-js'
import { ReactNode } from 'react'
import { createColorModeManager } from '@/lib/services/chakra/colorModeManager'

const customTheme: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
}

export const theme = extendTheme(customTheme)

export function ThemeProvider({
  children,
  initialColorMode,
}: {
  children: ReactNode
  initialColorMode?: string
}) {
  const colorModeManager = createColorModeManager(initialColorMode)

  return (
    <>
      <ColorModeScript
        initialColorMode={customTheme.config?.initialColorMode}
        type="cookie"
      />
      <ChakraCacheProvider>
        <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
          {children}
        </ChakraProvider>
      </ChakraCacheProvider>
    </>
  )
}
