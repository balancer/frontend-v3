'use client'
import Link from 'next/link'
import { Stack, Text, Box } from '@chakra-ui/react'
import { motion, easeOut } from 'framer-motion'

export function Footer() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        ease: easeOut,
        duration: 1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  }

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
      as={motion.footer}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Box as={motion.div} variants={item}>
        <Link href="/terms-of-use" prefetch={true}>
          <Text fontSize="sm">Terms of use</Text>
        </Link>
      </Box>
      <Box as={motion.div} variants={item}>
        <Link href="/privacy-policy" prefetch={true}>
          <Text fontSize="sm">Privacy policy</Text>
        </Link>
      </Box>
      <Box as={motion.div} variants={item}>
        <Link href="/cookies-policy" prefetch={true}>
          <Text fontSize="sm">Cookies policy</Text>
        </Link>
      </Box>
      <Box as={motion.div} variants={item}>
        <Link href="/risks" prefetch={true}>
          <Text fontSize="sm">Risks</Text>
        </Link>
      </Box>
      <Box as={motion.div} variants={item}>
        <Link href="/components" prefetch={true}>
          <Text fontSize="sm">Components</Text>
        </Link>
      </Box>
    </Stack>
  )
}
