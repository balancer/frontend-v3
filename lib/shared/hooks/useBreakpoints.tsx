import { useBreakpointValue } from '@chakra-ui/react'

export function useBreakpoints() {
  const isMobile = useBreakpointValue({ base: true, lg: false }, { ssr: true })
  return {
    isMobile,
    isDesktop: !isMobile,
  }
}
