'use client'

import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Box } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { XCircle } from 'react-feather'

type Props = AlertProps & {
  title: string
}

export function ErrorAlert({ title, children, ...rest }: PropsWithChildren<Props>) {
  return (
    <Alert rounded="md" status="error" mb="0" {...rest}>
      <AlertIcon as={XCircle} boxSize="1.5em" />

      <Box ml="sm">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Box>
    </Alert>
  )
}
