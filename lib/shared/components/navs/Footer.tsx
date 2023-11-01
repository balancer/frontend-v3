'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, Flex, Text } from '@chakra-ui/react'

export function Footer() {
  return (
    <Flex
      mt="2xl"
      h="20"
      bg="chakra-subtle-bg"
      align="center"
      p="md"
      gap="md"
      position="sticky"
      top="100vh"
    >
      <Link href="terms-of-use">
        <Text fontSize="sm">Terms of use</Text>
      </Link>
      <Link href="privacy-policy">
        <Text fontSize="sm">Privacy policy</Text>
      </Link>
    </Flex>
  )
}
