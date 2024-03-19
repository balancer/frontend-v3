import { useTheme } from 'next-themes'
import { DEFAULT_THEME } from './theme'

export type ThemeColor = 'light' | 'dark'

export function useThemeColor(): ThemeColor {
  const { theme } = useTheme()

  const _theme = theme as ThemeColor | undefined

  return _theme || DEFAULT_THEME
}
