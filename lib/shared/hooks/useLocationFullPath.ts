import { usePathname, useSearchParams } from 'next/navigation'

export function useLocationFullPath() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hashString = typeof window !== 'undefined' ? window.location.hash : ''

  const paramsString = searchParams.toString() ? `?${searchParams.toString()}` : ''

  return `${pathname}${paramsString}${hashString}`
}
