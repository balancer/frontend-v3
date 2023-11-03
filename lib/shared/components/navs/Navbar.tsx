'use client'
import Link from 'next/link'
import DarkModeToggle from '../btns/DarkModeToggle'
import { Box, Stack, HStack, Show } from '@chakra-ui/react'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { BalancerLogo } from '../imgs/BalancerLogo'
import { BalancerLogoType } from '../imgs/BalancerLogoType'
import { useBreakpoints } from '../../hooks/useBreakpoints'

export function Navbar() {
  const { isMobile } = useBreakpoints()

  return (
    <Stack
      flexDirection={{ base: 'column', md: 'row' }}
      justify={{ base: 'flex-start', md: 'space-between' }}
      fontWeight="medium"
      as="nav"
    >
      <HStack padding="md" order={{ md: '2' }}>
        <DarkModeToggle />
        <ConnectWallet />
      </HStack>
      <HStack padding="md" spacing="lg">
        <Link href="/">
          <Box display="flex" gap="1.5">
            { isMobile ? <BalancerLogo width="24px" /> : <BalancerLogoType width="106px" />}
          </Box>
        </Link>
        <Link href="/pools">Pools</Link>
        <Link href="/debug">Debug</Link>
      </HStack>
    </Stack>
  )
}
