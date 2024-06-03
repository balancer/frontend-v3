'use client'

import { useEffect } from 'react'
import { usePartnerTheme } from './PartnerThemeProvider'
import { getProjectConfig } from '@/lib/config/getProjectConfig'

export function PartnerThemeToggle({ themeName }: { themeName: string }) {
  const { toggleTheme } = usePartnerTheme()
  const defaultThemeName = getProjectConfig().projectId

  useEffect(() => {
    toggleTheme(themeName)

    return () => toggleTheme(defaultThemeName)
  }, [])

  return null
}
