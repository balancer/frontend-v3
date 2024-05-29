import { usePathname } from 'next/navigation'

export function useNav() {
  const pathname = usePathname()

  const appLinks = [
    {
      href: '/pools',
      label: 'Pools',
    },
    {
      href: '/swap',
      label: 'Swap',
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
    },
  ]

  function linkColorFor(path: string) {
    return pathname === path ? 'font.highlight' : 'font.primary'
  }

  return { appLinks, linkColorFor }
}
