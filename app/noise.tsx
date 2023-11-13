import { Container } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function Noise({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <Container backgroundColor="sand.50" width="full" height="full" maxWidth="full">
      <Container
        backgroundImage="url('/images/background-noise.png')"
        // backgroundColor="noise"
        width="full"
        height="full"
        maxWidth="full"
      >
        {children}
      </Container>
    </Container>
  )
}
