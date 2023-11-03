import { useBreakpointValue } from '@chakra-ui/react'

export function useBreakpoints() {
  return {
    isMobile: useBreakpointValue({ base: true, lg: false }, { ssr: true }),
  }
}
