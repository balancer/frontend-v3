'use client'

import { ThemeTypings } from '@chakra-ui/react'
import { ReactNode, createContext, useState } from 'react'
import { theme as balTheme } from './themes/bal/theme'
import { theme as gyroTheme } from './themes/gyro/theme'
import { useMandatoryContext } from '../../utils/contexts'

export type usePartnerTheme = ReturnType<typeof _usePartnerTheme>

type ThemeContext = { theme: ThemeTypings; toggleTheme: (theme: string) => void }

export const PartnerThemeContext = createContext<ThemeContext>({} as ThemeContext)

function _usePartnerTheme() {
  const [theme, setTheme] = useState<ThemeTypings>(balTheme)

  const toggleTheme = (themeName: string) => {
    switch (themeName) {
      case 'gyro':
        setTheme(gyroTheme)
        break
      case 'balancer':
        setTheme(balTheme)
        break
      case 'beets':
        //setTheme(beetsTheme) // TODO implement beets theme
        break
      default:
        setTheme(balTheme)
    }
  }

  return { theme, toggleTheme }
}

export function PartnerThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = _usePartnerTheme()

  return (
    <PartnerThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </PartnerThemeContext.Provider>
  )
}

export const usePartnerTheme = (): usePartnerTheme =>
  useMandatoryContext(PartnerThemeContext, 'PartnerThemeProvider')
