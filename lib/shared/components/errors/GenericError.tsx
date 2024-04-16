'use client'

import { AlertProps, Text } from '@chakra-ui/react'
import { ErrorAlert } from './ErrorAlert'

type ErrorWithOptionalShortMessage = Error & { shortMessage?: string }
type Props = AlertProps & { error: ErrorWithOptionalShortMessage }

export function GenericError({ error, ...rest }: Props) {
  const errorMessage = error?.shortMessage || error.message
  return (
    <ErrorAlert title={error.name} {...rest}>
      <Text color="font.maxContrast" variant="secondary">
        Error details: {errorMessage}
      </Text>
    </ErrorAlert>
  )
}
