import { ColorMode } from '@chakra-ui/react'

export const COLOR_MODE_STORAGE_KEY = 'chakra-ui-color-mode'

type MaybeColorMode = ColorMode | undefined

interface StorageManager {
  type: 'cookie' | 'localStorage'
  ssr?: boolean
  get(init?: ColorMode): MaybeColorMode
  set(value: ColorMode | 'system'): void
}

function parseCookie(cookie: string, key: string): MaybeColorMode {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
  return match?.[2] as MaybeColorMode
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

      return parseCookie(document.cookie, COLOR_MODE_STORAGE_KEY) || init
    },
    set(value) {
      document.cookie = `${COLOR_MODE_STORAGE_KEY}=${value}; max-age=31536000; path=/`
    },
  }
}
