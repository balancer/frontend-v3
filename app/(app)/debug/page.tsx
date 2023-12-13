'use client'
import { Heading, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'

export default function Debug() {
  return (
    <VStack padding="lg" margin="lg">
      <Heading size="md">Demos</Heading>
      <Link
        as={NextLink}
        href="pools/ethereum/v2/0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512/add-liquidity"
        color="blue"
      >
        Add liquidity in wjAura-weth (unbalanced)
      </Link>
      <Link as={NextLink} href="/debug/token-select" color="blue">
        Token select
      </Link>
      <Link as={NextLink} href="/debug/token-input" color="blue">
        Token input
      </Link>
    </VStack>
  )
}
