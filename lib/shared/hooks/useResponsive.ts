import { useMediaQuery } from '@chakra-ui/react'

export function useResponsive() {
  const [isDesktop] = useMediaQuery('(min-width: 768px)')

  const isMobile = !isDesktop

  return {
    isMobile,
    isDesktop,
  }
}
