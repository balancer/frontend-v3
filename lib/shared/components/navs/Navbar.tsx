'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, Flex, HStack } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'

export function Navbar() {
  return (
    <Flex
      flexDirection={{ base: 'column', md: 'row' }}
      justify={{ base: 'flex-start', md: 'space-between' }}
    >
      <HStack padding="md" order={{ md: '2' }}>
        <DarkModeToggle />
        <ConnectWallet />
      </HStack>
      <HStack padding="md" spacing="lg">
        <Link href="/">
          <Box>&#9775; Balancer</Box>
        </Link>
        <Link href="/pools">Pools</Link>
        <Link href="/debug">Debug</Link>
      </HStack>
    </Flex>
  )
}
