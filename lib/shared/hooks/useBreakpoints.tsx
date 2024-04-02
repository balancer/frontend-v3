import { useBreakpointValue } from '@chakra-ui/react'

export function useBreakpoints() {
  // Counter intuitive, but setting ssr to false will make the hook work as
  // expected with server components...
  const isMobile = useBreakpointValue({ base: true, lg: false }, { ssr: false })

  return {
    isMobile,
    isDesktop: !isMobile,
  }
}
