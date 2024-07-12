import { Container, ContainerProps } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function DefaultPageContainer({ children, ...rest }: PropsWithChildren & ContainerProps) {
  return (
    <Container
      maxW="maxContent"
      py={['xl', '2xl']}
      px={['ms', 'md']}
      overflowX={{ base: 'hidden', md: 'visible' }}
      {...rest}
    >
      {children}
    </Container>
  )
}
