'use client'

import { Alert, AlertDescription, AlertProps, AlertTitle, Icon, Box } from '@chakra-ui/react'
import { XCircle } from 'react-feather'

type Props = AlertProps & {
  title: string
  children: React.ReactNode
}

export function ErrorAlert({ title, children, ...rest }: Props) {
  return (
    <Alert rounded="md" status="error" mb="0" {...rest}>
      <Icon as={XCircle} color="red.500" boxSize="1.5em" />
      <Box ml="md">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Box>
    </Alert>
  )
}
