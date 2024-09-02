'use client'

import { FallbackProps } from 'react-error-boundary'
import { Button, Box, Text, Heading, VStack } from '@chakra-ui/react'
import { ensureError } from '../../utils/errors'
import { DefaultPageContainer } from '../containers/DefaultPageContainer'

export function BoundaryError({
  error,
  resetErrorBoundary,
}: {
  error: Error & { digest?: string }
  resetErrorBoundary: () => void
}) {
  const _error = ensureError(error)

  return (
    <Box w="full" minH="200px" border="2px dashed" borderColor="red.500" p="md" rounded="lg">
      <VStack align="start" spacing="md">
        <Heading size="md">Something went wrong! :(</Heading>
        <VStack align="start" spacing="xs">
          <Text>
            {_error?.name
              ? `${_error?.name}: ${_error?.shortMessage || ''}`
              : _error?.shortMessage || ''}
          </Text>
          <Text>{_error?.message}</Text>
        </VStack>

        <Button size="sm" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </VStack>
    </Box>
  )
}

export function PageErrorBoundary(props: FallbackProps) {
  return (
    <DefaultPageContainer>
      <BoundaryError {...props} />
    </DefaultPageContainer>
  )
}
