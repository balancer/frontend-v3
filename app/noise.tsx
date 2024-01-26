'use client'
import { Container } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function Noise({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <Container
      backgroundImage={`url('/images/background-noise.png')`}
      width="full"
      minH="screenHeight"
      maxWidth="full"
      p="0"
    >
      <Container
        backgroundColor="background.baseWithOpacity"
        width="full"
        minH="screenHeight"
        maxWidth="full"
        p="0"
      >
        {children}
      </Container>
    </Container>
  )
}
