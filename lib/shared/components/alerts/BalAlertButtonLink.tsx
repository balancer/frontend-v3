'use client'

import { Button, ButtonProps, Link } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { ArrowUpRight } from 'react-feather'

export function BalAlertButtonLink({
  href,
  children,
}: PropsWithChildren<ButtonProps> & { href: string }) {
  return (
    <Button
      as={Link}
      target="_blank"
      href={href}
      width="auto"
      variant="outline"
      h="24px"
      py="md"
      my="-1"
      color="font.dark"
      borderColor="font.dark"
      _hover={{
        transform: 'scale(1.05)',
        color: 'font.dark',
        borderColor: 'font.dark',
        backgroundColor: 'transparent',
      }}
      _active={{
        borderColor: 'font.dark',
        color: 'green',
      }}
      rightIcon={<ArrowUpRight />}
    >
      {children}
    </Button>
  )
}
