import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

export function ErrorAlert({ errorMessage }: { errorMessage: string }) {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}
