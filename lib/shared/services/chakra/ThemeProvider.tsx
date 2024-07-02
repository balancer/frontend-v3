'use client'

import { ChakraProvider, ThemeTypings } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { PoolVariant, BaseVariant, PartnerVariant } from '@/lib/modules/pool/pool.types'
import { theme as balTheme } from './themes/bal/bal.theme'
import { theme as cowTheme } from './themes/cow/cow.theme'
import { getProjectConfig } from '@/lib/config/getProjectConfig'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { variant } = useParams<{ variant?: PoolVariant }>()

  const { projectName } = getProjectConfig()

  function getDefaultTheme() {
    switch (projectName) {
      // case 'BeethovenX':
      //   return beetsTheme
      case 'Balancer':
        return balTheme
      default:
        return balTheme
    }
  }
  const defaultTheme = getDefaultTheme()

  function getTheme(): ThemeTypings {
    switch (variant) {
      case PartnerVariant.cow:
        return cowTheme
      case BaseVariant.v2:
        return defaultTheme
      default:
        return defaultTheme
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
