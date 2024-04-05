'use client'
import Link from 'next/link'
import { Stack, Text, Box } from '@chakra-ui/react'
import { staggeredFadeIn, fadeIn } from '@/lib/shared/utils/animations'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <Box as="footer" position="sticky" top="100vh">
      <Stack
        borderTop="1px solid"
        borderColor="border.base"
        px="lg"
        py="xl"
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap="md"
        as={motion.div}
        variants={staggeredFadeIn}
        initial="hidden"
        animate="show"
      >
        <Box as={motion.div} variants={fadeIn}>
          <Link href="/terms-of-use" prefetch={true}>
            <Text fontSize="sm">Terms of use</Text>
          </Link>
        </Box>
        <Box as={motion.div} variants={fadeIn}>
          <Link href="/privacy-policy" prefetch={true}>
            <Text fontSize="sm">Privacy policy</Text>
          </Link>
        </Box>
        <Box as={motion.div} variants={fadeIn}>
          <Link href="/cookies-policy" prefetch={true}>
            <Text fontSize="sm">Cookies policy</Text>
          </Link>
        </Box>
        <Box as={motion.div} variants={fadeIn}>
          <Link href="/risks" prefetch={true}>
            <Text fontSize="sm">Risks</Text>
          </Link>
        </Box>
        <Box as={motion.div} variants={fadeIn}>
          <Link href="/components" prefetch={true}>
            <Text fontSize="sm">Components</Text>
          </Link>
        </Box>
      </Stack>
    </Box>
  )
}
