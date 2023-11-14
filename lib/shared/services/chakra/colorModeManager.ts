import { COOKIE_KEYS } from '@/lib/modules/cookies/cookie.constants'
import { ColorMode } from '@chakra-ui/react'
import Cookies from 'js-cookie'

type MaybeColorMode = ColorMode | undefined

interface StorageManager {
  type: 'cookie' | 'localStorage'
  ssr?: boolean
  get(initColorMode?: ColorMode): MaybeColorMode
  set(value: ColorMode | 'system'): void
}

export function createColorModeManager(initialCookieValue?: string): StorageManager {
  return {
    ssr: true,
    type: 'cookie',
    get(initColorMode?): MaybeColorMode {
      if (initialCookieValue) {
        return initialCookieValue as MaybeColorMode
      }

      if (!globalThis?.document) {
        return initColorMode
      }

      return (Cookies.get(COOKIE_KEYS.UserSettings.ColorMode) as ColorMode) || initColorMode
    },
    set(value) {
      Cookies.set(COOKIE_KEYS.UserSettings.ColorMode, value)
    },
  }
}
