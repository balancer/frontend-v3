'use client'

import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

export function useCookieState<T>(
  key: string,
  defaultValue: T | string = ''
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (globalThis?.document) {
      return (Cookies.get(key) || defaultValue) as T
    }
    return defaultValue as T
  })

  useEffect(() => {
    Cookies.set(key, value as string)
  }, [key, value])

  return [value, setValue]
}
