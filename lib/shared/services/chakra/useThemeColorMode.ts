import { useTheme } from 'next-themes'
import { DEFAULT_THEME_COLOR_MODE } from './theme'

export type ThemeColor = 'light' | 'dark'

export function useThemeColorMode(): ThemeColor {
  const { theme } = useTheme()

  const _theme = theme as ThemeColor | undefined

  return _theme || DEFAULT_THEME_COLOR_MODE
}
