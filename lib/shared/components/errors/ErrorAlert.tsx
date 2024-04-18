'use client'

import { Alert, AlertProps, HStack, Heading, Icon, VStack } from '@chakra-ui/react'
import { XCircle } from 'react-feather'

type Props = AlertProps & {
  title: string
  children: React.ReactNode
}

export function ErrorAlert({ title, children, ...rest }: Props) {
  return (
    <Alert rounded="md" status="error" mb="0" {...rest}>
      <VStack align="start">
        <HStack alignContent="flex-start">
          <Icon as={XCircle} color="red.500" boxSize="1.5em" />
          <Heading textColor="red.500" size="h6">
            {title}
          </Heading>
        </HStack>
        {children}
      </VStack>
    </Alert>
  )
}
