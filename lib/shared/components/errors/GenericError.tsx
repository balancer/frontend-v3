'use client'

import { AlertProps, Text } from '@chakra-ui/react'
import { ErrorAlert } from './ErrorAlert'
import { isUserRejectedError } from '../../utils/error-filters'

type ErrorWithOptionalShortMessage = Error & { shortMessage?: string }
type Props = AlertProps & {
  error: ErrorWithOptionalShortMessage
  customErrorName?: string
}

export function GenericError({ error, customErrorName, ...rest }: Props) {
  if (isUserRejectedError(error)) return null
  const errorName = customErrorName ? `${customErrorName} (${error.name})` : error.name
  const errorMessage = error?.shortMessage || error.message
  return (
    <ErrorAlert title={errorName} {...rest}>
      <Text variant="secondary" color="black">
        Error details: {errorMessage}
      </Text>
    </ErrorAlert>
  )
}
