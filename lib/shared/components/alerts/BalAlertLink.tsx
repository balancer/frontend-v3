'use client'

import { Link, LinkProps } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

export function BalAlertLink({ href, children, ...rest }: PropsWithChildren<LinkProps>) {
  return (
    <Link href={href} variant="nav" color="white" target="_blank" {...rest}>
      {children}
    </Link>
  )
}
