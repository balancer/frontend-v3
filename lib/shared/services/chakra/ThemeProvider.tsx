'use client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { CacheProvider as ChakraCacheProvider } from '@chakra-ui/next-js'
import { ReactNode } from 'react'
import { createColorModeManager } from '@/lib/shared/services/chakra/colorModeManager'
import theme, { balTheme } from './theme'

export function ThemeProvider({
  children,
  initialColorMode,
}: {
  children: ReactNode
  initialColorMode?: 'light' | 'dark' | 'system'
}) {
  const colorModeManager = createColorModeManager(initialColorMode)

  return (
    <>
      <ColorModeScript
        initialColorMode={balTheme.config?.initialColorMode as 'light' | 'dark' | 'system'}
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
