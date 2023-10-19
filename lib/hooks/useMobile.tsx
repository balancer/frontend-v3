import { useBreakpointValue } from '@chakra-ui/react'

export function useMobile() {
  return useBreakpointValue({ base: true, lg: false })
}
