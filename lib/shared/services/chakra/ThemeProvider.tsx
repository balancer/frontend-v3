'use client'

import { ChakraProvider, ThemeTypings } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { PoolVariant } from '@/lib/modules/pool/pool.types'
import { theme as balTheme } from './themes/bal/theme'
import { theme as cowTheme } from './themes/cow/theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { variant } = useParams<{ variant?: PoolVariant }>()

  function getTheme(): ThemeTypings {
    switch (variant) {
      case PoolVariant.cow:
        return cowTheme
      case PoolVariant.v2:
        return balTheme
      default:
        return balTheme
    }
  }

  return (
    <ChakraProvider
      theme={getTheme()}
      cssVarsRoot="body"
      toastOptions={{ defaultOptions: { position: 'bottom-left' } }}
    >
      {children}
    </ChakraProvider>
  )
}
