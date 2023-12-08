'use client'
import Link from 'next/link'
import { Stack, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <Stack
      borderTop="1px solid"
      borderColor="border.base"
      px="lg"
      py="xl"
      align="center"
      direction={{ base: 'column', md: 'row' }}
      gap="md"
      position="sticky"
      top="100vh"
      as="footer"
    >
      <Link href="/terms-of-use" prefetch={true}>
        <Text fontSize="sm">Terms of use</Text>
      </Link>
      <Link href="/privacy-policy" prefetch={true}>
        <Text fontSize="sm">Privacy policy</Text>
      </Link>
      <Link href="/cookies-policy" prefetch={true}>
        <Text fontSize="sm">Cookies policy</Text>
      </Link>
      <Link href="/components" prefetch={true}>
        <Text fontSize="sm">Components</Text>
      </Link>
    </Stack>
  )
}
