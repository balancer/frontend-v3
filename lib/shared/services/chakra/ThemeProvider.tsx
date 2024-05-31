'use client'

import { ChakraProvider, ThemeTypings } from '@chakra-ui/react'
import { ReactNode, createContext, useContext, useState } from 'react'
import { theme as balTheme } from './theme'
import { theme as gyroTheme } from './gyroTheme'

type ThemeContext = { theme: ThemeTypings; toggleTheme: (theme: string) => void }

export const ThemeContext = createContext<ThemeContext>({} as ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeTypings>(balTheme)

  const toggleTheme = (theme: string) => {
    switch (theme) {
      case 'gyro':
        setTheme(gyroTheme)
        break
      case 'bal':
        setTheme(balTheme)
        break
      default:
        setTheme(balTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ChakraProvider
        theme={theme}
        cssVarsRoot="body"
        toastOptions={{ defaultOptions: { position: 'bottom-left' } }}
      >
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  )
}
