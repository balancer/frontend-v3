import { Container } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function DefaultPageContainer({ children }: PropsWithChildren) {
  return (
    <Container
      maxW="maxContent"
      py={['xl', '2xl']}
      px={['ms', 'md']}
      overflowX={{ base: 'hidden', md: 'visible' }}
    >
      {children}
    </Container>
  )
}
