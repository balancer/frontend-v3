'use client'
import Link from 'next/link'
import { Stack, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <Stack
      mt="2xl"
      bg="chakra-subtle-bg"
      px="lg"
      py="xl"
      align="center"
      direction={{ base: 'column', md: 'row' }}
      gap="md"
      position="sticky"
      top="100vh"
      as="footer"
    >
      <Link href="terms-of-use">
        <Text fontSize="sm">Terms of use</Text>
      </Link>
      <Link href="privacy-policy">
        <Text fontSize="sm">Privacy policy</Text>
      </Link>
      <Link href="cookies-policy">
        <Text fontSize="sm">Cookies policy</Text>
      </Link>
    </Stack>
  )
}
