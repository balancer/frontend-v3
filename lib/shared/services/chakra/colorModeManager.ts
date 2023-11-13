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
    get(init?): MaybeColorMode {
      if (initialCookieValue) {
        return initialCookieValue as MaybeColorMode
      }

      if (!globalThis?.document) {
        return init
      }

      return (Cookies.get(COOKIE_KEYS.UserSettings.ColorMode) as ColorMode) || init
    },
    set(value) {
      Cookies.set(COOKIE_KEYS.UserSettings.ColorMode, value)
    },
  }
}
